import {
  tradeEthForExactTokensWithData,
  tradeExactEthForTokensWithData,
  tradeExactTokensForEthWithData,
  tradeExactTokensForTokensWithData,
  tradeTokensForExactEthWithData,
  tradeTokensForExactTokensWithData,
} from '@uniswap/sdk';
import {
  filter,
  findIndex,
  get,
  isNil,
  keys,
  map,
} from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { InteractionManager, LayoutAnimation, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { NavigationActions, NavigationEvents, withNavigationFocus } from 'react-navigation';
import { compose, mapProps, toClass, withProps } from 'recompact';
import { executeSwap } from '../handlers/uniswap';
import {
  convertAmountFromNativeValue,
  convertAmountToNativeAmount,
  convertAmountToRawAmount,
  convertRawAmountToDecimalFormat,
  greaterThan,
  subtract,
} from '../helpers/utilities';
import {
  withAccountAddress,
  withAccountData,
  withAccountSettings,
  withBlockedHorizontalSwipe,
  withKeyboardFocusHistory,
  withTransactionConfirmationScreen,
  withTransitionProps,
  withUniswapAllowances,
  withUniswapAssets,
} from '../hoc';
import { colors, padding, position } from '../styles';
import {
  contractUtils,
  deviceUtils,
  ethereumUtils,
  safeAreaInsetValues,
} from '../utils';
import {
  ConfirmExchangeButton,
  ExchangeGasFeeButton,
  ExchangeInputField,
  ExchangeModalHeader,
  ExchangeOutputField,
  SlippageWarning,
} from '../components/exchange';
import { FloatingPanel, FloatingPanels } from '../components/expanded-state';
import GestureBlocker from '../components/GestureBlocker';
import {
  Centered,
  Column,
  KeyboardFixedOpenLayout,
} from '../components/layout';
import { Text } from '../components/text';
import { CurrencySelectionTypes } from './CurrencySelectModal';

export const exchangeModalBorderRadius = 30;

const AnimatedFloatingPanels = Animated.createAnimatedComponent(toClass(FloatingPanels));

const isSameAsset = (firstAsset, secondAsset) => {
  if (!firstAsset || !secondAsset) {
    return false;
  }

  const firstAddress = get(firstAsset, 'address', '').toLowerCase();
  const secondAddress = get(secondAsset, 'address', '').toLowerCase();
  return firstAddress === secondAddress;
};

class ExchangeModal extends PureComponent {
  static propTypes = {
    accountAddress: PropTypes.string,
    allAssets: PropTypes.array,
    allowances: PropTypes.object,
    chainId: PropTypes.number,
    clearKeyboardFocusHistory: PropTypes.func,
    dataAddNewTransaction: PropTypes.func,
    keyboardFocusHistory: PropTypes.array,
    nativeCurrency: PropTypes.string,
    navigation: PropTypes.object,
    pushKeyboardFocusHistory: PropTypes.func,
    tradeDetails: PropTypes.object,
    uniswapGetTokenReserve: PropTypes.func,
    uniswapUpdateAllowances: PropTypes.func,
  }

  state = {
    inputAllowance: null,
    inputAmount: null,
    inputAmountDisplay: null,
    inputAsExactAmount: false,
    inputCurrency: ethereumUtils.getAsset(this.props.allAssets),
    nativeAmount: null,
    needsApproval: false,
    outputAmount: null,
    outputAmountDisplay: null,
    outputCurrency: null,
    showConfirmButton: false,
    slippage: null,
    tradeDetails: null,
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { isFocused, isTransitioning, keyboardFocusHistory} = this.props;
    const { inputAmount, outputAmount, outputCurrency } = this.state;

    if (isFocused && (!isTransitioning && prevProps.isTransitioning)) {
      const lastFocusedInput = keyboardFocusHistory[keyboardFocusHistory.length - 2];

      if (lastFocusedInput) {
        InteractionManager.runAfterInteractions(() => {
          TextInput.State.focusTextInput(lastFocusedInput);
        });
      } else {
        // console.log('ELSE')
        // this.inputFieldRef.focus();
      }
    }

    if (inputAmount || outputAmount) {
      LayoutAnimation.easeInEaseOut();
    }

    if (outputCurrency) {
      // console.log('should showConfirmButton');
      this.setState({ showConfirmButton: true });
    }

    if (this.state.inputCurrency.address !== prevState.inputCurrency.address) {
      this.getCurrencyAllowance();
    }
  }

  componentWillUnmount = () => {
    this.props.clearKeyboardFocusHistory();
  }

  inputFieldRef = null

  nativeFieldRef = null

  outputFieldRef = null

  parseTradeDetails = (path, tradeDetails, decimals) => {
    const updatedValue = get(tradeDetails, path);
    const slippage = get(tradeDetails, 'marketRateSlippage');
    const rawUpdatedValue = convertRawAmountToDecimalFormat(updatedValue, decimals);
    return { rawUpdatedValue, slippage: slippage.toFixed() };
  };

  getCurrencyAllowance = async () => {
    const { accountAddress, allowances, uniswapUpdateAllowances } = this.props;
    const { inputCurrency } = this.state;
    if (inputCurrency.address === 'eth') {
      this.setState({ needsApproval: false });
      return;
    }
    const allowance = allowances[inputCurrency.address];
    if (isNil(allowance)) {
      this.setState({ needsApproval: true });
    } else {
      this.setState({ needsApproval: !greaterThan(allowance, 0) });
    }
    const newAllowance = await contractUtils.getAllowance(accountAddress, inputCurrency, inputCurrency.exchangeAddress);
    uniswapUpdateAllowances(inputCurrency.address, newAllowance);
    this.setState({ needsApproval: !greaterThan(newAllowance, 0) });
  };

  getReserveData = async tokenAddress => {
    let reserve = this.props.tokenReserves[tokenAddress.toLowerCase()];
    if (isNil(reserve)) {
      reserve = await this.props.uniswapGetTokenReserve(tokenAddress);
    }
    return reserve;
  };

  getMarketDetails = async () => {
    try {
      let tradeDetails = null;
      const { chainId } = this.props;
      const {
        inputAmount,
        inputAsExactAmount,
        inputCurrency,
        outputAmount,
        outputCurrency,
      } = this.state;
      if (inputCurrency === null || outputCurrency === null) return;
      if (isNil(inputAmount) && isNil(outputAmount)) return;
      const {
        address: inputCurrencyAddress,
        decimals: inputDecimals,
      } = inputCurrency;
      const {
        address: outputCurrencyAddress,
        decimals: outputDecimals,
      } = outputCurrency;
      const rawInputAmount = convertAmountToRawAmount(inputAmount || 0, inputDecimals);
      const rawOutputAmount = convertAmountToRawAmount(outputAmount || 0, outputDecimals);

      if (inputCurrencyAddress === 'eth' && outputCurrencyAddress !== 'eth') {
        const outputCurrencyReserve = await this.getReserveData(outputCurrencyAddress);
        tradeDetails = inputAsExactAmount
          ? tradeExactEthForTokensWithData(outputCurrencyReserve, rawInputAmount, chainId)
          : tradeEthForExactTokensWithData(outputCurrencyReserve, rawOutputAmount, chainId);
      } else if (inputCurrencyAddress !== 'eth' && outputCurrencyAddress === 'eth') {
        const inputCurrencyReserve = await this.getReserveData(inputCurrencyAddress);
        tradeDetails = inputAsExactAmount
          ? tradeExactTokensForEthWthData(inputCurrencyReserve, rawInputAmount, chainId)
          : tradeTokensForExactEthWithData(inputCurrencyReserve, rawOutputAmount, chainId);
      } else if (inputCurrencyAddress !== 'eth' && outputCurrencyAddress !== 'eth') {
        const inputCurrencyReserve = await this.getReserveData(inputCurrencyAddress);
        const outputCurrencyReserve = await this.getReserveData(outputCurrencyAddress);
        tradeDetails = inputAsExactAmount
          ? tradeExactTokensForTokensWithData(inputCurrencyReserve, outputCurrencyReserve, rawInputAmount, chainId)
          : tradeTokensForExactTokensWithData(inputCurrencyReserve, outputCurrencyReserve, rawOutputAmount, chainId);
      }
      const decimals = inputAsExactAmount ? outputDecimals : inputDecimals;
      const path = inputAsExactAmount ? 'outputAmount.amount' : 'inputAmount.amount';
      this.setState({ tradeDetails });
      const { rawUpdatedValue, slippage } = this.parseTradeDetails(path, tradeDetails, decimals);
      if (inputAsExactAmount) {
        const outputAmountDisplay = updatePrecisionToDisplay(rawUpdatedValue, get(outputCurrency, 'price.value'));
        this.setState({ outputAmount: rawUpdatedValue, outputAmountDisplay, slippage });
      } else {
        const inputAmountDisplay = updatePrecisionToDisplay(rawUpdatedValue, get(inputCurrency, 'price.value'));
        this.setState({ inputAmount: rawUpdatedValue, inputAmountDisplay, slippage });
      }
    } catch (error) {
      console.log('error getting market details', error);
      // TODO
    }
  }

  setNativeAmount = async nativeAmountDisplay => {
    const nativeAmount = convertAmountFromNativeDisplay(nativeAmountDisplay, this.props.nativeCurrency);
    const inputAmount = convertAmountFromNativeValue(nativeAmount, get(this.state.inputCurrency, 'native.price.amount', 0));
    const inputAmountDisplay = updatePrecisionToDisplay(inputAmount, get(inputCurrency, 'price.value'));
    this.setState({
      inputAmount,
      inputAmountDisplay,
      inputAsExactAmount: true,
      nativeAmount: nativeAmountDisplay,
    });
  }

  setInputAmount = async inputAmount => {
    const nativeAmount = convertAmountToNativeAmount(
      inputAmount,
      get(this.state.inputCurrency, 'native.price.amount', 0)
    );
    this.setState({
      inputAmount,
      inputAmountDisplay: inputAmount,
      inputAsExactAmount: true,
      nativeAmount,
    });
  }

  setOutputAmount = async outputAmount => {
    this.setState({
      inputAsExactAmount: false,
      outputAmount,
      outputAmountDisplay: outputAmount,
    });
  }

  setInputCurrency = (inputCurrencySelection, force) => {
    const { accountAddress } = this.props;
    const { inputCurrency, outputCurrency } = this.state;

    console.log('inputCurrencySelection', inputCurrencySelection);
    const allowance = contractUtils.getAllowance(accountAddress);
    this.setState({ inputCurrency: inputCurrencySelection });

    if (!force && isSameAsset(inputCurrency, outputCurrency)) {
      if (outputCurrency !== null && inputCurrency !== null) {
        return this.setOutputCurrency(null, true);
      }

      return this.setOutputCurrency(inputCurrency, true);
    }
  }

  setOutputCurrency = (outputCurrency, force) => {
    const { allAssets } = this.props;
    const { inputCurrency } = this.state;

    this.setState({ outputCurrency });

    if (!force && isSameAsset(inputCurrency, outputCurrency)) {
      console.log('outputCurrency', outputCurrency);
      const asset = ethereumUtils.getAsset(allAssets, outputCurrency.address.toLowerCase());

      console.log('asset', asset);

      if (inputCurrency !== null && outputCurrency !== null && !isNil(asset)) {
        this.setInputCurrency(null, true);
      } else {
        this.setInputCurrency(outputCurrency, true);
      }
    }
  }

  onPressMaxBalance = () => {
    const { inputCurrency } = this.state;
    const balance = get(inputCurrency, 'balance.amount', 0);
    const inputAmount = (inputCurrency.address === 'eth') ? subtract(balance, 0.01) : balance;
    this.setState({ inputAmount });
  }

  handleSelectInputCurrency = () => {
    this.props.navigation.navigate('CurrencySelectScreen', {
      type: CurrencySelectionTypes.input,
      onSelectCurrency: this.setInputCurrency,
    });
  }

  handleSelectOutputCurrency = () => {
    this.props.navigation.navigate('CurrencySelectScreen', {
      type: CurrencySelectionTypes.output,
      onSelectCurrency: this.setOutputCurrency,
    });
  }

  handleSubmit = async () => {
    const { accountAddress, dataAddNewTransaction, navigation } = this.props;
    const { inputAmount, inputCurrency, tradeDetails } = this.state;

    try {
      const txn = await executeSwap(tradeDetails);
      if (txn) {
        dataAddNewTransaction({
          amount: inputAmount,
          asset: inputCurrency,
          from: accountAddress,
          hash: txn.hash,
          nonce: get(txn, 'nonce'),
          to: get(txn, 'to'),
        });
      }
      navigation.navigate('ProfileScreen');
    } catch (error) {
      console.log('error submitting swap', error);
      navigation.navigate('WalletScreen');
    }
  }

  handleWillFocus = ({ lastState }) => {
    if (!lastState && this.inputFieldRef) {
      this.inputFieldRef.focus();
    }
  }

  handleInputFieldRef = (ref) => { this.inputFieldRef = ref; }

  handleNativeFieldRef = (ref) => { this.nativeFieldRef = ref; }

  handleOutputFieldRef = (ref) => { this.outputFieldRef = ref; }

  handleDidFocus = () => {
    // console.log('DID FOCUS', this.props.navigation)

    // if (this.inputFieldRef) {
    //   setTimeout(() => this.inputFieldRef.focus(), 250);
    // }
  }

  handleFocusField = ({ currentTarget }) => {
    this.props.pushKeyboardFocusHistory(currentTarget);
  }

  render = () => {
    const {
      keyboardFocusHistory,
      nativeCurrency,
      navigation,
      onPressConfirmExchange,
      transitionPosition,
    } = this.props;

    const {
      inputAmountDisplay,
      inputCurrency,
      nativeAmount,
      needsApproval,
      outputAmountDisplay,
      outputCurrency,
      showConfirmButton,
      slippage,
    } = this.state;

    console.log(' ')
    console.log('ExchangeModal -- this.props', this.props);
    console.log('ExchangeModal -- this.state', this.state);
    console.log(' ')


    return (
      <KeyboardFixedOpenLayout>
        <NavigationEvents
          onDidFocus={this.handleDidFocus}
          onWillFocus={this.handleWillFocus}
        />
        <Centered
          {...position.sizeAsObject('100%')}
          backgroundColor={colors.transparent}
          direction="column"
        >
          <AnimatedFloatingPanels
            margin={0}
            style={{
              opacity: Animated.interpolate(transitionPosition, {
                extrapolate: 'clamp',
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <FloatingPanel radius={exchangeModalBorderRadius}>
              <ExchangeModalHeader />
              <Column align="center" flex={0}>
                <ExchangeInputField
                  inputAmount={inputAmountDisplay}
                  inputCurrency={get(inputCurrency, 'symbol', null)}
                  inputFieldRef={this.handleInputFieldRef}
                  isAssetApproved={false}
                  nativeAmount={nativeAmount}
                  nativeCurrency={nativeCurrency}
                  nativeFieldRef={this.handleNativeFieldRef}
                  needsApproval={needsApproval}
                  onFocus={this.handleFocusField}
                  onPressMaxBalance={this.onPressMaxBalance}
                  onPressSelectInputCurrency={this.handleSelectInputCurrency}
                  setInputAmount={this.setInputAmount}
                  setNativeAmount={this.setNativeAmount}
                />
                <ExchangeOutputField
                  onPressSelectOutputCurrency={this.handleSelectOutputCurrency}
                  outputAmount={outputAmountDisplay}
                  onFocus={this.handleFocusField}
                  outputCurrency={get(outputCurrency, 'symbol', null)}
                  outputFieldRef={this.handleOutputFieldRef}
                  setOutputAmount={this.setOutputAmount}
                />
              </Column>
            </FloatingPanel>
            <SlippageWarning slippage={slippage} />
            {showConfirmButton && (
              <Fragment>
                <Centered
                  css={padding(19, 15, 0)}
                  flexShrink={0}
                  width="100%"
                >
                  <ConfirmExchangeButton
                    disabled={!Number(inputAmountDisplay)}
                    onPress={this.handleSubmit}
                  />
                </Centered>
                <ExchangeGasFeeButton
                  gasPrice={'$0.06'}
                />
              </Fragment>
            )}
          </AnimatedFloatingPanels>
        </Centered>
      </KeyboardFixedOpenLayout>
    );
  }
}

const withMockedPrices = withProps({
  currencyToDollar: 3,
  targetCurrencyToDollar: 2,
});

export default compose(
  withAccountAddress,
  withAccountData,
  withAccountSettings,
  withBlockedHorizontalSwipe,
  withKeyboardFocusHistory,
  withMockedPrices,
  withNavigationFocus,
  withTransactionConfirmationScreen,
  withTransitionProps,
  withUniswapAllowances,
  withUniswapAssets,
  mapProps(({
    navigation,
    tabsTransitionProps: {
      isTransitioning: isTabsTransitioning,
    },
    stackTransitionProps: {
      isTransitioning: isStacksTransitioning,
    },
    ...props,
  }) => ({
    ...props,
    isTransitioning: isStacksTransitioning || isTabsTransitioning,
    navigation,
    transitionPosition: get(navigation, 'state.params.position'),
  })),
)(ExchangeModal);

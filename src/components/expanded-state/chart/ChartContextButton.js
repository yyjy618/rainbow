import lang from 'i18n-js';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Linking } from 'react-native';
import { ContextCircleButton } from '../../context-menu';
import EditOptions from '@rainbow-me/helpers/editOptionTypes';
import { useAccountSettings, useCoinListEditOptions } from '@rainbow-me/hooks';
import { ethereumUtils } from '@rainbow-me/utils';

export default function ChartContextButton({ asset, color }) {
  const {
    clearSelectedCoins,
    currentAction,
    pushSelectedCoin,
    setHiddenCoins,
    setPinnedCoins,
  } = useCoinListEditOptions();

  const { network } = useAccountSettings();
  const etherscanHost = ethereumUtils.getEtherscanHostFromNetwork(network);

  useEffect(() => {
    // Ensure this expanded state's asset is always actively inside
    // the CoinListEditOptions selection queue
    pushSelectedCoin(asset?.uniqueId);

    // Clear CoinListEditOptions selection queue on unmount.
    return () => clearSelectedCoins();
  }, [asset, clearSelectedCoins, currentAction, pushSelectedCoin]);

  const handleActionSheetPress = useCallback(
    buttonIndex => {
      if (buttonIndex === 0) {
        // 📌️ Pin
        setPinnedCoins();
      } else if (buttonIndex === 1) {
        // 🙈️ Hide
        setHiddenCoins();
      } else if (buttonIndex === 2 && asset?.address !== 'eth') {
        // 🔍 View on Etherscan
        Linking.openURL(`https://${etherscanHost}/token/${asset?.address}`);
      }
    },
    [asset?.address, etherscanHost, setHiddenCoins, setPinnedCoins]
  );

  const options = useMemo(
    () => [
      `📌️ ${
        currentAction === EditOptions.unpin
          ? lang.t('button.unpin')
          : lang.t('button.pin')
      }`,
      `🙈️ ${
        currentAction === EditOptions.unhide
          ? lang.t('button.unhide')
          : lang.t('button.hide')
      }`,
      ...(asset?.address === 'eth' ? [] : [lang.t('button.etherscan')]),
      lang.t('wallet.action.cancel'),
    ],
    [asset?.address, currentAction]
  );

  return (
    <ContextCircleButton
      flex={0}
      onPressActionSheet={handleActionSheetPress}
      options={options}
      tintColor={color}
    />
  );
}

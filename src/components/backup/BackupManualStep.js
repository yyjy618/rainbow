import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import lang from 'i18n-js';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/primitives';
import { Column } from '../layout';
import { SecretDisplaySection } from '../secret-display';
import { SheetActionButton } from '../sheet';
import { Nbsp, Text } from '../text';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import {
  useDimensions,
  useWalletManualBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { colors, padding } from '@rainbow-me/styles';

const Content = styled(Column).attrs({
  align: 'center',
  justify: 'start',
})`
  flex-grow: 1;
  flex-shrink: 0;
  padding-top: ${({ isTallPhone }) =>
    Platform.OS === 'android' ? 30 : isTallPhone ? 65 : 15};
`;

const Footer = styled(Column).attrs({
  justify: 'end',
})`
  ${padding(0, 15, 21)};
  width: 100%;
`;

const Masthead = styled(Column).attrs({
  align: 'center',
  justify: 'start',
})`
  padding-top: 18;
`;

const MastheadDescription = styled(Text).attrs({
  align: 'center',
  color: colors.alpha(colors.blueGreyDark, 0.6),
  lineHeight: 'looser',
  size: 'large',
})`
  max-width: 291;
`;

const MastheadIcon = styled(Text).attrs({
  align: 'center',
  color: 'appleBlue',
  size: 43,
  weight: 'semibold',
})``;

const MastheadTitle = styled(Text).attrs({
  align: 'center',
  size: 'big',
  weight: 'bold',
})`
  ${padding(15, 0, 12)};
`;

export default function BackupManualStep() {
  const { isTallPhone } = useDimensions();
  const { goBack } = useNavigation();
  const { selectedWallet } = useWallets();
  const { onManuallyBackupWalletId } = useWalletManualBackup();
  const { params } = useRoute();
  const walletId = params?.walletId || selectedWallet.id;

  const [type, setType] = useState(null);
  const [secretLoaded, setSecretLoaded] = useState(false);

  const onComplete = useCallback(() => {
    onManuallyBackupWalletId(walletId);
    analytics.track('Backup Complete', {
      category: 'backup',
      label: 'manual',
    });
    goBack();
  }, [goBack, onManuallyBackupWalletId, walletId]);

  useEffect(() => {
    analytics.track('Manual Backup Step', {
      category: 'backup',
      label: 'manual',
    });
  }, []);

  return (
    <Fragment>
      <Masthead>
        <MastheadIcon>􀉆</MastheadIcon>
        <MastheadTitle>{lang.t('back_up.manual.label')}</MastheadTitle>
        <MastheadDescription>
          <MastheadDescription weight="semibold">
            {type === WalletTypes.privateKey
              ? lang.t('back_up.manual.pkey.these_keys')
              : lang.t('back_up.manual.seed.these_keys')}
          </MastheadDescription>
          <Nbsp />
          {type === WalletTypes.privateKey
            ? lang.t('back_up.manual.pkey.save_them')
            : lang.t('back_up.manual.seed.save_them')}
        </MastheadDescription>
      </Masthead>
      <Content isTallPhone={isTallPhone}>
        <SecretDisplaySection
          onSecretLoaded={setSecretLoaded}
          onWalletTypeIdentified={setType}
        />
      </Content>
      <Footer>
        {secretLoaded && (
          <SheetActionButton
            color={colors.appleBlue}
            label={`􀁣  ${
              type === WalletTypes.privateKey
                ? lang.t('back_up.manual.pkey.confirm_save')
                : lang.t('back_up.manual.seed.confirm_save')
            }`}
            onPress={onComplete}
            size="big"
            weight="bold"
          />
        )}
      </Footer>
    </Fragment>
  );
}

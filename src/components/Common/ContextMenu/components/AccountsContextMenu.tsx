import React, { useCallback, useMemo } from 'react';
import { setCurrentAccount, useAccounts } from '@src/state';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';

interface IProps {
  children: React.ReactNode;
}

export default function AccountsContextMenu({
  children,
}: IProps): React.JSX.Element {
  const accounts = useAccounts();

  const options = useMemo(() => {
    return accounts.map((a) => ({
      key: a.fullUsername,
      title: a.username,
      ...(a.isCurrentAccount && {
        icon: 'checkmark',
      }),
    }));
  }, [accounts]);

  const onPress = useCallback((e: OnPressMenuItemEventObject): void => {
    setCurrentAccount(e.nativeEvent.actionKey);
  }, []);

  return (
    <AppContextMenuButton
      options={options}
      onPressMenuItem={onPress}
      isPrimaryAction={false}
      noPressable
    >
      {children}
    </AppContextMenuButton>
  );
}

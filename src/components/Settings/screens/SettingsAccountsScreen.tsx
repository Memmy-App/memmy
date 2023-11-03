import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  deleteAccount,
  setAccountNotifications,
  useAccounts,
  useCurrentAccount,
} from '@src/state';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';
import HeaderButton from '@components/Common/Button/HeaderButton';
import AccountsContextMenu from '@components/Common/ContextMenu/components/AccountsContextMenu';
import { Alert } from 'react-native';
import { useNotifications } from '@hooks/useNotifications';
import { useThemeColorScheme } from '@src/hooks';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAccountScreen({
  navigation,
}: IProps): React.JSX.Element {
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();
  const notifications = useNotifications();
  const colorScheme = useThemeColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Add Account"
          onPress={() => {
            navigation.navigate('AddAccount');
          }}
        />
      ),
    });
  }, []);

  return (
    <ScrollView flex={1}>
      <LoadingOverlay visible={notifications.isLoading} />
      <Table.Container>
        <Table.Section
          header="Current Account"
          footer="You can quickly change accounts by pressing and holding the profile tab button."
        >
          <Table.Cell label="Server" rightLabel={currentAccount?.instance} />
          <AccountsContextMenu>
            <Table.Cell
              label="Username"
              rightLabel={currentAccount?.username}
              isLast
            />
          </AccountsContextMenu>
        </Table.Section>
        {accounts.map((account, index) => (
          <Table.Section header={account.fullUsername} key={index}>
            <Table.Cell
              label="Push Notifications"
              switchValue={account.notificationsEnabled ?? false}
              onSwitchValueChange={async (v) => {
                if (v) {
                  Alert.alert(
                    'Push Notifications',
                    'Because Lemmy does not offer scoped access to user accounts, enabling push notifications requires providing Memmy with your account access token.\n\nThis token can be used to access your Lemmy account and is valid until you sign out or change your password. We do not use your access token for anything other than retrieving notification status, but we just wanted to let you know.\n\nSee our Privacy Policy for more information.',
                    [
                      {
                        text: 'View Privacy Policy',
                        onPress: () => {
                          navigation.push('WebView', { source: 'privacy' });
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Continue',
                        onPress: async () => {
                          const res = await notifications.enableOrDisable(
                            account,
                            'enable',
                          );

                          if (res) {
                            setAccountNotifications(account, true);
                          } else {
                            Alert.alert(
                              'Error',
                              'Error disabling notifications.',
                              undefined,
                              { userInterfaceStyle: colorScheme },
                            );
                          }
                        },
                        style: 'default',
                      },
                    ],
                    {
                      userInterfaceStyle: colorScheme,
                    },
                  );
                } else {
                  const res = await notifications.enableOrDisable(
                    account,
                    'disable',
                  );

                  if (res) {
                    setAccountNotifications(account, false);
                  } else {
                    Alert.alert(
                      'Error',
                      'Error disabling notifications.',
                      undefined,
                      { userInterfaceStyle: colorScheme },
                    );
                  }
                }
              }}
            />
            <Table.Cell
              label="Logout"
              useChevron
              onPress={() => {
                deleteAccount(account);
                navigation.push('Feed', { screen: 'FeedIndex' });
              }}
            />
          </Table.Section>
        ))}
      </Table.Container>
    </ScrollView>
  );
}

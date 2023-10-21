import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { deleteAccount, useAccounts, useCurrentAccount } from '@src/state';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';
import HeaderButton from '@components/Common/Button/HeaderButton';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAccountScreen({
  navigation,
}: IProps): React.JSX.Element {
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();

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
      <Table.Container>
        <Table.Section header="Current Account">
          <Table.Cell label="Server" rightLabel={currentAccount?.instance} />
          <Table.Cell label="Username" rightLabel={currentAccount?.username} />
        </Table.Section>
        {accounts.map((account, index) => (
          <Table.Section header={account.fullUsername} key={index}>
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

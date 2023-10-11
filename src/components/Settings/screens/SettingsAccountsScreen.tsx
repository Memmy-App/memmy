import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useAccounts,
  useCurrentAccount,
} from '@src/state/account/accountStore';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { deleteAccount } from '@src/state/account/actions';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAccountScreen({
  navigation,
}: IProps): React.JSX.Element {
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();

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
              label="Edit Account"
              useChevron
              onPress={() => {
                navigation.navigate('EditAccount', { account });
              }}
            />
            <Table.Cell
              label="Logout"
              useChevron
              onPress={() => {
                deleteAccount(account);
                navigation.navigate('Feed', { screen: 'FeedIndex' });
              }}
            />
          </Table.Section>
        ))}
      </Table.Container>
    </ScrollView>
  );
}

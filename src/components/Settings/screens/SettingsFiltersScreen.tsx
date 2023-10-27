import React from 'react';
import { INavigationProps } from '@src/types';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';

export default function SettingsFiltersScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Filters">
          <Table.Cell
            label="Instance Filters"
            onPress={() => navigation.navigate('Filter', { type: 'instance' })}
            useChevron
          />
          <Table.Cell
            label="Keyword Filters"
            onPress={() => navigation.navigate('Filter', { type: 'keyword' })}
            useChevron
          />
        </Table.Section>
        <Table.Section header="Blocks">
          <Table.Cell
            label="Blocked Users"
            onPress={() => navigation.navigate('BlockedUsers')}
            useChevron
          />
          <Table.Cell
            label="Blocked Communities"
            onPress={() => navigation.navigate('BlockedCommunities')}
            useChevron
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

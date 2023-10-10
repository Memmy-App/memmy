import React from 'react';
import Table from '@components/Common/Table/Table';
import { ScrollView } from 'tamagui';

export default function SettingsIndexScreen(): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section>
          <Table.Cell label="General" useChevron />
          <Table.Cell label="Content" useChevron />
          <Table.Cell label="Appearance" useChevron />
          <Table.Cell label="Accounts" rightLabel="test" useChevron />
          <Table.Cell label="Filters" useChevron />
          <Table.Cell label="About" useChevron />
        </Table.Section>
        <Table.Section header="Memmy">
          <Table.Cell label="Privacy" useChevron />
          <Table.Cell label="Terms" useChevron />
          <Table.Cell label="Report a Bug" useChevron />
          <Table.Cell label="Check Lemmy Service" useChevron />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

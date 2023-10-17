import React from 'react';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { INavigationProps } from '@src/types';

export default function SettingsThemeScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Accent">
          <Table.Cell
            label="Accent Color"
            useChevron
            onPress={() => {
              navigation.push('Accent');
            }}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

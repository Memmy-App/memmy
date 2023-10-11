import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { getBuildNumber, getReadableVersion } from 'react-native-device-info';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAboutScreen({
  navigation,
}: IProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section>
          <Table.Cell
            label="Version"
            rightLabel={`${getReadableVersion()} (${getBuildNumber()})`}
          />
          <Table.Cell label="License" useChevron onPress={() => {}} />
          <Table.Cell label="Acknowledgements" useChevron onPress={() => {}} />
          <Table.Cell label="Privacy Policy" useChevron onPress={() => {}} />
          <Table.Cell label="Terms" useChevron onPress={() => {}} />
          <Table.Cell label="GitHub" useChevron onPress={() => {}} />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

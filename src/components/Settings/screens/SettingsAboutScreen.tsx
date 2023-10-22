import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Table from '@components/Common/Table/Table';
import { getBuildNumber, getReadableVersion } from 'react-native-device-info';
import ScrollView from '@components/Common/Gui/ScrollView';
import { openLink } from '@helpers/links';
import { useTheme } from 'tamagui';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAboutScreen({
  navigation,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section footer="Mouse Loading Icon by Icons8">
          <Table.Cell
            label="Version"
            rightLabel={`${getReadableVersion()} (${getBuildNumber()})`}
          />
          <Table.Cell
            label="License"
            useChevron
            onPress={() => {
              navigation.push('WebView', { source: 'licenseAgreement' });
            }}
          />
          <Table.Cell
            label="Acknowledgements"
            useChevron
            onPress={() => {
              navigation.push('WebView', { source: 'acknowledgements' });
            }}
          />
          <Table.Cell
            label="Privacy Policy"
            useChevron
            onPress={() => {
              navigation.push('WebView', { source: 'privacy' });
            }}
          />
          <Table.Cell
            label="Terms"
            useChevron
            onPress={() => {
              navigation.push('WebView', { source: 'terms' });
            }}
          />
          <Table.Cell
            label="GitHub"
            useChevron
            onPress={() => {
              void openLink(
                'https://github.com/memmy-app/memmy',
                theme.navBarBg.val,
              );
            }}
          />
          <Table.Cell
            label="Icons8"
            useChevron
            onPress={() => {
              void openLink('https://icons8.com/', theme.navBarBg.val);
            }}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

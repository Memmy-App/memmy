import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { Switch } from 'react-native';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsContentScreen({
  navigation,
}: IProps): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Defaults">
          <Table.Cell
            label="Post Sort"
            rightLabel={settings.defaultSort}
            useChevron
          />
          <Table.Cell
            label="Comment Sort"
            rightLabel={settings.defaultCommentSort}
            useChevron
          />
          <Table.Cell
            label="Listing Type"
            rightLabel={settings.defaultListingType}
            useChevron
          />
        </Table.Section>
        <Table.Section
          header="NSFW Content"
          footer="The Show NSFW setting is determined by your Lemmy account's NSFW settings while the Blur NSFW setting is set locally."
        >
          <Table.Cell label="Show NSFW Content" accessoryRight={<Switch />} />
          <Table.Cell label="Blur NSFW Content" accessoryRight={<Switch />} />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

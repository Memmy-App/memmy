import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { Switch } from 'react-native';
import ListingTypeContextMenu from '@components/Common/ContextMenu/components/ListingTypeContextMenu';
import { setSetting } from '@src/state/settings/actions/setSetting';
import SortTypeContextMenu from '@components/Common/ContextMenu/components/SortTypeContextMenu';
import CommentSortTypeContextMenu from '@components/Common/ContextMenu/components/CommentSortTypeContextMenu';
import { addSpaceBeforeCapital } from '@helpers/text';

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
          <SortTypeContextMenu
            selection={settings.defaultSort}
            onPressMenuItem={(e) => {
              setSetting('defaultSort', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Post Sort"
              rightLabel={addSpaceBeforeCapital(settings.defaultSort)}
              useChevron
            />
          </SortTypeContextMenu>

          <CommentSortTypeContextMenu
            selection={settings.defaultCommentSort}
            onPressMenuItem={(e) => {
              setSetting('defaultCommentSort', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Comment Sort"
              rightLabel={settings.defaultCommentSort}
              useChevron
            />
          </CommentSortTypeContextMenu>

          <ListingTypeContextMenu
            selection={settings.defaultListingType}
            onPressMenuItem={(e) => {
              setSetting('defaultListingType', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Listing Type"
              rightLabel={settings.defaultListingType}
              useChevron
            />
          </ListingTypeContextMenu>
        </Table.Section>
        <Table.Section>
          <Table.Cell
            label="Mark Read Options"
            useChevron
            onPress={() => {
              navigation.navigate('Read');
            }}
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

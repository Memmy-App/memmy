import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Table from '@components/Common/Table/Table';
import {
  setSetting,
  setUserSetting,
  useSettingsStore,
  useShowNsfw,
} from '@src/state';
import ListingTypeContextMenu from '@components/Common/ContextMenu/components/ListingTypeContextMenu';
import SortTypeContextMenu from '@components/Common/ContextMenu/components/SortTypeContextMenu';
import CommentSortTypeContextMenu from '@components/Common/ContextMenu/components/CommentSortTypeContextMenu';
import { addSpaceBeforeCapital } from '@helpers/text';
import ScrollView from '@components/Common/Gui/ScrollView';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsContentScreen({
  navigation,
}: IProps): React.JSX.Element {
  const settings = useSettingsStore();
  const showNsfw = useShowNsfw();

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
              label="Post Sort in Feed"
              rightLabel={addSpaceBeforeCapital(settings.defaultSort)}
              useChevron
              isFirst
            />
          </SortTypeContextMenu>

          <SortTypeContextMenu
            selection={settings.defaultCommunitySort}
            onPressMenuItem={(e) => {
              setSetting('defaultCommunitySort', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Post Sort in Community"
              rightLabel={addSpaceBeforeCapital(settings.defaultCommunitySort)}
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
              isLast
            />
          </ListingTypeContextMenu>
        </Table.Section>
        <Table.Section>
          <Table.Cell
            label="Mark Read Options"
            useChevron
            onPress={() => {
              navigation.push('Read');
            }}
          />
        </Table.Section>
        <Table.Section
          header="NSFW Content"
          footer="The Show NSFW setting is determined by your Lemmy account's NSFW settings while the Blur NSFW setting is set locally."
        >
          <Table.Cell
            label="Show NSFW Content"
            switchValue={showNsfw}
            onSwitchValueChange={async (v) => {
              await setUserSetting('show_nsfw', v);
            }}
          />
          <Table.Cell
            label="Blur NSFW Content"
            switchValue={settings.blurNsfw}
            onSwitchValueChange={(v) => {
              setSetting('blurNsfw', v);
            }}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

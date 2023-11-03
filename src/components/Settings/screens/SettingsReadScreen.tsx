import React from 'react';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';
import {
  IReadOptions,
  setUserSetting,
  useSettingsStore,
  useShowReadPosts,
} from '@src/state';

export default function SettingsReadScreen(): React.JSX.Element {
  const settings = useSettingsStore();
  const showReadPosts = useShowReadPosts();

  const setReadOption = <T extends keyof IReadOptions>(
    key: T,
    value: boolean,
  ): void => {
    useSettingsStore.setState((state) => {
      state.readOptions[key] = value;
    });
  };

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Read Options">
          <Table.Cell
            label="Show Read Posts"
            switchValue={showReadPosts}
            onSwitchValueChange={(v) => {
              void setUserSetting('show_read_posts', v);
            }}
          />
        </Table.Section>

        <Table.Section header="Marking Read">
          <Table.Cell
            label="On Post Open"
            switchValue={settings.readOptions.onPostView}
            onSwitchValueChange={(v) => {
              setReadOption('onPostView', v);
            }}
          />
          <Table.Cell
            label="On Link Open"
            switchValue={settings.readOptions.onLinkOpen}
            onSwitchValueChange={(v) => {
              setReadOption('onLinkOpen', v);
            }}
          />
          <Table.Cell
            label="On Image View"
            switchValue={settings.readOptions.onImageView}
            onSwitchValueChange={(v) => {
              setReadOption('onImageView', v);
            }}
          />
          <Table.Cell
            label="On Vote"
            switchValue={settings.readOptions.onVote}
            onSwitchValueChange={(v) => {
              setReadOption('onVote', v);
            }}
          />
          <Table.Cell
            label="On Feed Scroll"
            switchValue={settings.readOptions.onFeedScroll}
            onSwitchValueChange={(v) => {
              setReadOption('onFeedScroll', v);
            }}
          />
          <Table.Cell
            label="On Community Scroll"
            switchValue={settings.readOptions.onCommunityScroll}
            onSwitchValueChange={(v) => {
              setReadOption('onCommunityScroll', v);
            }}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

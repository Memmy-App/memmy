import React from 'react';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';
import { Switch } from 'react-native';
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
            accessoryRight={
              <Switch
                value={settings.readOptions.onPostView}
                onChange={(e) => {
                  setReadOption('onPostView', e.nativeEvent.value);
                }}
              />
            }
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
            accessoryRight={
              <Switch
                value={settings.readOptions.onImageView}
                onChange={(e) => {
                  setReadOption('onImageView', e.nativeEvent.value);
                }}
              />
            }
          />
          <Table.Cell
            label="On Vote"
            accessoryRight={
              <Switch
                value={settings.readOptions.onVote}
                onChange={(e) => {
                  setReadOption('onVote', e.nativeEvent.value);
                }}
              />
            }
          />
          <Table.Cell
            label="On Feed Scroll"
            accessoryRight={
              <Switch
                value={settings.readOptions.onFeedScroll}
                onChange={(e) => {
                  setReadOption('onFeedScroll', e.nativeEvent.value);
                }}
              />
            }
          />
          <Table.Cell
            label="On Community Scroll"
            accessoryRight={
              <Switch
                value={settings.readOptions.onCommunityScroll}
                onChange={(e) => {
                  setReadOption('onCommunityScroll', e.nativeEvent.value);
                }}
              />
            }
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

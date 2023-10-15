import React from 'react';
import { createContextMenuOptionsFromStrings } from '@helpers/contextMenu';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { setPostGestureSetting } from '@src/state/settings/actions';
import { capitalizeFirstLetter } from '@helpers/text';
import { postGestureOptions } from '@src/types';
import { LayoutAnimation, Switch } from 'react-native';

export default function SettingsGesturesScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const postSwipeOptions =
    createContextMenuOptionsFromStrings(postGestureOptions);

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Post Gestures">
          <Table.Cell
            label="Post Gestures Enabled"
            accessoryRight={
              <Switch
                value={settings.gestures.post.enabled}
                onChange={(e) => {
                  setPostGestureSetting('enabled', e.nativeEvent.value);
                }}
              />
            }
          />
          <AppContextMenuButton
            options={postSwipeOptions}
            onPressMenuItem={(e) => {
              setPostGestureSetting('firstLeft', e.nativeEvent.actionKey);

              if (e.nativeEvent.actionKey === 'none') {
                setPostGestureSetting('secondLeft', 'none');
              }
            }}
          >
            <Table.Cell
              label="Left to Right First"
              rightLabel={
                capitalizeFirstLetter(settings.gestures.post.firstLeft) ??
                'None'
              }
              useChevron
            />
          </AppContextMenuButton>
          {settings.gestures.post.firstLeft !== 'none' && (
            <AppContextMenuButton
              options={postSwipeOptions}
              onPressMenuItem={(e) => {
                setPostGestureSetting('secondLeft', e.nativeEvent.actionKey);
              }}
              onLayout={() => {
                LayoutAnimation.linear();
              }}
            >
              <Table.Cell
                label="Left to Right Second"
                rightLabel={
                  capitalizeFirstLetter(settings.gestures.post.secondLeft) ??
                  'None'
                }
                useChevron
              />
            </AppContextMenuButton>
          )}
          <AppContextMenuButton
            options={postSwipeOptions}
            onPressMenuItem={(e) => {
              setPostGestureSetting('firstRight', e.nativeEvent.actionKey);

              if (e.nativeEvent.actionKey === 'none') {
                setPostGestureSetting('secondRight', 'none');
              }
            }}
          >
            <Table.Cell
              label="Right to Left First"
              rightLabel={
                capitalizeFirstLetter(settings.gestures.post.firstRight) ??
                'None'
              }
              useChevron
            />
          </AppContextMenuButton>
          {settings.gestures.post.firstRight !== 'none' && (
            <AppContextMenuButton
              options={postSwipeOptions}
              onPressMenuItem={(e) => {
                setPostGestureSetting('secondRight', e.nativeEvent.actionKey);
              }}
              onLayout={() => {
                LayoutAnimation.linear();
              }}
            >
              <Table.Cell
                label="Right to Left Second"
                rightLabel={
                  capitalizeFirstLetter(settings.gestures.post.secondRight) ??
                  'None'
                }
                useChevron
              />
            </AppContextMenuButton>
          )}
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

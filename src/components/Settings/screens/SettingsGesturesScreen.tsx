import React from 'react';
import { createContextMenuOptionsFromStrings } from '@helpers/contextMenu';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { setPostGestureSetting } from '@src/state/settings/actions';
import { capitalizeFirstLetter } from '@helpers/text';
import { postGestureOptions } from '@src/types';

export default function SettingsGesturesScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const postSwipeOptions =
    createContextMenuOptionsFromStrings(postGestureOptions);

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Post Gestures">
          <AppContextMenuButton
            options={postSwipeOptions}
            onPressMenuItem={(e) => {
              setPostGestureSetting('firstLeft', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Swipe Left First"
              rightLabel={capitalizeFirstLetter(
                settings.gestures.post.firstLeft,
              )}
              useChevron
            />
          </AppContextMenuButton>
          <AppContextMenuButton
            options={postSwipeOptions}
            onPressMenuItem={(e) => {
              setPostGestureSetting('secondLeft', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Swipe Left Second"
              rightLabel={capitalizeFirstLetter(
                settings.gestures.post.secondLeft,
              )}
              useChevron
            />
          </AppContextMenuButton>
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

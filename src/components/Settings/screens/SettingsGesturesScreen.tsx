import React, { useMemo } from 'react';
import { createContextMenuOptionsFromStrings } from '@helpers/contextMenu';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import {
  setCommentGestureSetting,
  setPostGestureSetting,
  setSetting,
  useSettingsStore,
} from '@src/state';
import { capitalizeFirstLetter } from '@helpers/text';
import { commentGestureOptions, postGestureOptions } from '@src/types';
import { LayoutAnimation, Switch } from 'react-native';

export default function SettingsGesturesScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const postSwipeOptions = useMemo(
    () => createContextMenuOptionsFromStrings(postGestureOptions),
    [],
  );
  const commentSwipeOptions = useMemo(
    () => createContextMenuOptionsFromStrings(commentGestureOptions),
    [],
  );

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section
          header="Swipe to Go Back"
          footer="Enabling full width swipes will disable post and comment swipe gestures."
        >
          <Table.Cell
            label="Full Width Swipe Gestures"
            switchValue={settings.fullWidthSwipes}
            onSwitchValueChange={(v) => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              if (v) {
                setPostGestureSetting('enabled', false);
                setCommentGestureSetting('enabled', false);
              }
              setSetting('fullWidthSwipes', v);
            }}
          />
        </Table.Section>
        {!settings.fullWidthSwipes && (
          <>
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
                    setPostGestureSetting(
                      'secondLeft',
                      e.nativeEvent.actionKey,
                    );
                  }}
                  onLayout={() => {
                    LayoutAnimation.linear();
                  }}
                >
                  <Table.Cell
                    label="Left to Right Second"
                    rightLabel={
                      capitalizeFirstLetter(
                        settings.gestures.post.secondLeft,
                      ) ?? 'None'
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
                    setPostGestureSetting(
                      'secondRight',
                      e.nativeEvent.actionKey,
                    );
                  }}
                  onLayout={() => {
                    LayoutAnimation.linear();
                  }}
                >
                  <Table.Cell
                    label="Right to Left Second"
                    rightLabel={
                      capitalizeFirstLetter(
                        settings.gestures.post.secondRight,
                      ) ?? 'None'
                    }
                    useChevron
                    isLast
                  />
                </AppContextMenuButton>
              )}
            </Table.Section>

            <Table.Section header="Comment Gestures">
              <Table.Cell
                label="Comment Gestures Enabled"
                accessoryRight={
                  <Switch
                    value={settings.gestures.comment.enabled}
                    onChange={(e) => {
                      setCommentGestureSetting('enabled', e.nativeEvent.value);
                    }}
                  />
                }
              />
              <Table.Cell
                label="Tap to Collapse"
                accessoryRight={
                  <Switch
                    value={settings.gestures.comment.collapse}
                    onChange={(e) => {
                      setCommentGestureSetting('collapse', e.nativeEvent.value);
                    }}
                  />
                }
              />
              <AppContextMenuButton
                options={commentSwipeOptions}
                onPressMenuItem={(e) => {
                  setCommentGestureSetting(
                    'firstLeft',
                    e.nativeEvent.actionKey,
                  );

                  if (e.nativeEvent.actionKey === 'none') {
                    setCommentGestureSetting('secondLeft', 'none');
                  }
                }}
              >
                <Table.Cell
                  label="Left to Right First"
                  rightLabel={
                    capitalizeFirstLetter(
                      settings.gestures.comment.firstLeft,
                    ) ?? 'None'
                  }
                  useChevron
                />
              </AppContextMenuButton>
              {settings.gestures.comment.firstLeft !== 'none' && (
                <AppContextMenuButton
                  options={commentSwipeOptions}
                  onPressMenuItem={(e) => {
                    setCommentGestureSetting(
                      'secondLeft',
                      e.nativeEvent.actionKey,
                    );
                  }}
                  onLayout={() => {
                    LayoutAnimation.linear();
                  }}
                >
                  <Table.Cell
                    label="Left to Right Second"
                    rightLabel={
                      capitalizeFirstLetter(
                        settings.gestures.comment.secondLeft,
                      ) ?? 'None'
                    }
                    useChevron
                  />
                </AppContextMenuButton>
              )}
              <AppContextMenuButton
                options={commentSwipeOptions}
                onPressMenuItem={(e) => {
                  setCommentGestureSetting(
                    'firstRight',
                    e.nativeEvent.actionKey,
                  );

                  if (e.nativeEvent.actionKey === 'none') {
                    setCommentGestureSetting('secondRight', 'none');
                  }
                }}
              >
                <Table.Cell
                  label="Right to Left First"
                  rightLabel={
                    capitalizeFirstLetter(
                      settings.gestures.comment.firstRight,
                    ) ?? 'None'
                  }
                  useChevron
                />
              </AppContextMenuButton>
              {settings.gestures.comment.firstRight !== 'none' && (
                <AppContextMenuButton
                  options={commentSwipeOptions}
                  onPressMenuItem={(e) => {
                    setCommentGestureSetting(
                      'secondRight',
                      e.nativeEvent.actionKey,
                    );
                  }}
                  onLayout={() => {
                    LayoutAnimation.linear();
                  }}
                >
                  <Table.Cell
                    label="Right to Left Second"
                    rightLabel={
                      capitalizeFirstLetter(
                        settings.gestures.comment.secondRight,
                      ) ?? 'None'
                    }
                    useChevron
                    isLast
                  />
                </AppContextMenuButton>
              )}
            </Table.Section>
          </>
        )}
      </Table.Container>
    </ScrollView>
  );
}

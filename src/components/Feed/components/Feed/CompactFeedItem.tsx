import React, { useCallback, useMemo } from 'react';
import { usePostGesturesEnabled, useSettingsStore } from '@src/state';
import { usePostSwipeOptions } from '@components/Common/SwipeableRow/hooks/usePostSwipeOptions';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, XStack, YStack } from 'tamagui';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import CompactFeedItemThumbnail from '@components/Feed/components/Feed/CompactFeedItem/CompactFeedItemThumbnail';
import CompactFeedItemTitle from '@components/Feed/components/Feed/CompactFeedItemTitle';
import PostMetrics from '@components/Common/PostCard/PostMetrics';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { Pressable } from 'react-native';
import CompactFeedItemVoteButtons from '@components/Feed/components/Feed/CompactFeedItem/CompactFeedItemVoteButtons';

interface IProps {
  itemId: number;
}

function CompactFeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const thumbnailPosition = useSettingsStore(
    (state) => state.compactThumbnailPosition,
  );
  const voteButtonPosition = useSettingsStore(
    (state) => state.compactVoteButtonPosition,
  );

  const gesturesEnabled = usePostGesturesEnabled();
  const leftSwipeOptions = usePostSwipeOptions('left');
  const rightSwipeOptions = usePostSwipeOptions('right');

  const onPress = useCallback(() => {
    navigation.push('Post', {
      postId: itemId,
    });
  }, [itemId]);

  const actionParams = useMemo(() => {
    return {
      postId: itemId,
      navigation,
    };
  }, [itemId, navigation]);

  return (
    <YStack my="$1" onPress={onPress} hitSlop={3}>
      <SwipeableRow
        leftOption={
          gesturesEnabled && leftSwipeOptions.actions.first != null ? (
            <LeftOptions
              options={leftSwipeOptions}
              actionParams={actionParams}
            />
          ) : undefined
        }
        rightOption={
          gesturesEnabled && rightSwipeOptions.actions.first !== null ? (
            <RightOptions
              options={rightSwipeOptions}
              actionParams={actionParams}
            />
          ) : undefined
        }
      >
        <XStack backgroundColor="$fg" py="$2" px="$2" space="$2">
          {voteButtonPosition === 'left' && (
            <CompactFeedItemVoteButtons itemId={itemId} />
          )}
          {thumbnailPosition === 'left' && (
            <CompactFeedItemThumbnail itemId={itemId} />
          )}
          <YStack flex={1} space="$1.5" justifyContent="space-between">
            <CompactFeedItemTitle itemId={itemId} />
            <PostCommunityLabel itemId={itemId} pressable={false} />
            <XStack justifyContent="space-between">
              <PostMetrics itemId={itemId} />
              <PostContextMenu itemId={itemId}>
                <Pressable hitSlop={10}>
                  <Ellipsis color={theme.accent.val} />
                </Pressable>
              </PostContextMenu>
            </XStack>
          </YStack>
          {thumbnailPosition === 'right' && (
            <CompactFeedItemThumbnail itemId={itemId} />
          )}
          {voteButtonPosition === 'right' && (
            <CompactFeedItemVoteButtons itemId={itemId} />
          )}
        </XStack>
      </SwipeableRow>
    </YStack>
  );
}

export default React.memo(CompactFeedItem);

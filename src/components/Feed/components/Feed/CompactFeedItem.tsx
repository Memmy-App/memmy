import React, { useCallback, useMemo } from 'react';
import {
  setPostRead,
  useCompactShowUsername,
  useMarkReadOnPostView,
  usePostCreator,
  usePostSaved,
  useSettingsStore,
} from '@src/state';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, View, XStack, YStack } from 'tamagui';
import CompactFeedItemThumbnail from '@components/Feed/components/Feed/CompactFeedItem/CompactFeedItemThumbnail';
import CompactFeedItemTitle from '@components/Feed/components/Feed/CompactFeedItemTitle';
import PostMetrics from '@components/Common/PostCard/PostMetrics';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { Pressable } from 'react-native';
import CompactFeedItemVoteButtons from '@components/Feed/components/Feed/CompactFeedItem/CompactFeedItemVoteButtons';
import PostUserLabel from '@components/Common/PostCard/PostUserLabel';
import { usePostSwipeOptions } from '@components/Common/SwipeableRow/hooks/usePostSwipeOptions';
import { playHaptic } from '@helpers/haptics';
import { Swipeable } from 'react-native-reanimated-swipeable';

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
  const markReadOnPostView = useMarkReadOnPostView();

  const actionParams = useMemo(
    () => ({
      navigation,
      postId: itemId,
    }),
    [itemId],
  );

  const leftSwipeOptions = usePostSwipeOptions('left', actionParams);
  const rightSwipeOptions = usePostSwipeOptions('right', actionParams);

  const postUser = usePostCreator(itemId);

  const showUsername = useCompactShowUsername();

  const postSaved = usePostSaved(itemId);

  const onPress = useCallback(() => {
    if (markReadOnPostView) {
      setPostRead({
        postId: itemId,
      });
    }

    navigation.push('Post', {
      postId: itemId,
    });
  }, [itemId]);

  return (
    <YStack my="$1" onPress={onPress} hitSlop={3}>
      <Swipeable
        leftActionGroup={leftSwipeOptions ?? undefined}
        rightActionGroup={rightSwipeOptions ?? undefined}
        options={{
          onHitStep: playHaptic,
        }}
      >
        {postSaved && (
          <View
            position="absolute"
            top={0}
            right={0}
            width={0}
            height={0}
            backgroundColor="transparent"
            borderTopColor="$bookmark"
            borderTopWidth={15}
            borderLeftWidth={15}
            borderLeftColor="transparent"
            zIndex={1}
          />
        )}
        <XStack
          backgroundColor="$fg"
          py="$2"
          px="$2"
          space="$2"
          alignItems="center"
        >
          {voteButtonPosition === 'left' && (
            <CompactFeedItemVoteButtons itemId={itemId} />
          )}
          {thumbnailPosition === 'left' && (
            <CompactFeedItemThumbnail itemId={itemId} />
          )}
          <YStack flex={1} space="$1.5" justifyContent="space-between">
            <CompactFeedItemTitle itemId={itemId} />
            <PostCommunityLabel itemId={itemId} pressable={false} />
            {showUsername && (
              <PostUserLabel
                userId={postUser?.id}
                userName={postUser?.name}
                userCommunity={postUser?.actor_id}
                userIcon={postUser?.avatar}
                isAdmin={postUser?.admin}
              />
            )}
            <XStack justifyContent="space-between">
              <PostMetrics itemId={itemId} />
              <PostContextMenu itemId={itemId}>
                <Pressable>
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
      </Swipeable>
    </YStack>
  );
}

export default React.memo(CompactFeedItem);

import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  setReplyRead,
  useMentionCommentId,
  useMentionContent,
  useMentionCreator,
  useMentionDeleted,
  useMentionPath,
  useMentionPostId,
  useMentionRead,
  useMentionRemoved,
  useReplyCommentId,
  useReplyContent,
  useReplyCreator,
  useReplyDeleted,
  useReplyPath,
  useReplyPostId,
  useReplyRead,
  useReplyRemoved,
} from '@src/state';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import instance from '@src/Instance';
import { Separator, View, YStack } from 'tamagui';
import { SwipeableActionParams } from '@helpers/swipeableActions';
import CommentHeader from '@components/Comment/components/CommentHeader';
import CommentContent from '@components/Comment/components/CommentContent';
import InboxReplyEllipsisButton from '@components/Inbox/components/InboxReplyEllipsisButton';
import InboxReplyMetrics from '@components/Inbox/components/InboxReplyMetrics';
import { Swipeable } from 'react-native-reanimated-swipeable';
import { useInboxReplySwipeOptions } from '@components/Common/SwipeableRow/hooks/useInboxReplySwipeOptions';
import { playHaptic } from '@helpers/haptics';

interface IProps {
  itemId: number;
  type: 'reply' | 'mention';
}

function InboxComment({ itemId, type }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postId =
    type === 'reply' ? useReplyPostId(itemId) : useMentionPostId(itemId);
  const commentId =
    type === 'reply' ? useReplyCommentId(itemId) : useMentionCommentId(itemId);
  const content =
    type === 'reply' ? useReplyContent(itemId) : useMentionContent(itemId);
  const removed =
    type === 'reply' ? useReplyRemoved(itemId) : useMentionRemoved(itemId);
  const deleted =
    type === 'reply' ? useReplyDeleted(itemId) : useMentionDeleted(itemId);
  const creator =
    type === 'reply' ? useReplyCreator(itemId) : useMentionCreator(itemId);
  const read = type === 'reply' ? useReplyRead(itemId) : useMentionRead(itemId);
  const path = type === 'reply' ? useReplyPath(itemId) : useMentionPath(itemId);

  const actionParams = useMemo<SwipeableActionParams>(
    () => ({
      commentId,
      replyId: type === 'reply' ? itemId : undefined,
      mentionId: type === 'mention' ? itemId : undefined,
      postId,
      navigation,
    }),
    [itemId],
  );

  const leftOptions = useInboxReplySwipeOptions('left', type, actionParams);
  const rightOptions = useInboxReplySwipeOptions('right', type, actionParams);

  const [loadingPost, setLoadingPost] = useState(false);

  const onPress = useCallback(async () => {
    // Display loading
    setLoadingPost(true);

    // Try to get the post and add it to the store
    try {
      await instance.getPost({ postId: postId ?? 0 });
      setLoadingPost(false);

      // Mark the reply as read
      if (type === 'reply') setReplyRead({ itemId, type: 'reply' });
      else setReplyRead({ itemId, type: 'mention' });

      const pathArr = path!.split('.');
      const parentId =
        pathArr.length === 2 ? pathArr[1] : pathArr[pathArr.length - 2];

      // Send to the post
      navigation.push('Post', {
        postId,
        parentCommentId: parentId,
      });
    } catch (e) {
      setLoadingPost(false);
    }
  }, [itemId]);

  const ellipsisButton = useCallback(
    () => (
      <InboxReplyEllipsisButton
        itemId={itemId}
        commentId={commentId!}
        type={type}
      />
    ),
    [itemId],
  );

  const commentMetrics = useCallback(
    () => (
      <InboxReplyMetrics itemId={itemId} commentId={commentId!} type={type} />
    ),
    [itemId],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <YStack my={2} onPress={onPress} hitSlop={3}>
      <LoadingOverlay visible={loadingPost} />
      <Swipeable
        leftActionGroup={leftOptions ?? undefined}
        rightActionGroup={rightOptions ?? undefined}
        options={{
          onHitStep: playHaptic,
        }}
      >
        {!read && (
          <View
            position="absolute"
            top={0}
            right={0}
            width={0}
            height={0}
            backgroundColor="transparent"
            borderTopColor="$error"
            borderTopWidth={15}
            borderLeftWidth={15}
            borderLeftColor="transparent"
            zIndex={1}
          />
        )}
        <YStack backgroundColor="$fg">
          <YStack my="$2" px="$2" py="$1">
            <CommentHeader
              creatorAvatar={creator?.avatar}
              userCommunity={creator?.actor_id}
              userName={creator?.name}
              EllipsisButton={ellipsisButton}
              CommentMetrics={commentMetrics}
              isAdmin={creator?.admin}
            />
            <CommentContent
              content={content}
              deleted={deleted}
              removed={removed}
            />
          </YStack>
          <Separator borderColor="$bg" />
        </YStack>
      </Swipeable>
    </YStack>
  );
}

export default React.memo(InboxComment);

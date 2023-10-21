import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  addPost,
  useCommentGesturesEnabled,
  useMentionCommentId,
  useMentionContent,
  useMentionCreatorActorId,
  useMentionCreatorAvatar,
  useMentionCreatorName,
  useMentionDeleted,
  useMentionPostId,
  useMentionRead,
  useMentionRemoved,
  useReplyCommentId,
  useReplyContent,
  useReplyCreatorActorId,
  useReplyCreatorAvatar,
  useReplyCreatorName,
  useReplyDeleted,
  useReplyPostId,
  useReplyRead,
  useReplyRemoved,
} from '@src/state';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import instance from '@src/Instance';
import { Separator, View, YStack } from 'tamagui';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { SwipeableActionParams } from '@helpers/swipeableActions';
import CommentHeader from '@components/Comment/components/CommentHeader';
import CommentContent from '@components/Comment/components/CommentContent';
import InboxReplyEllipsisButton from '@components/Inbox/components/InboxReplyEllipsisButton';
import { useInboxReplySwipeOptions } from '@components/Common/SwipeableRow/hooks/useInboxReplySwipeOptions';
import InboxReplyMetrics from '@components/Inbox/components/InboxReplyMetrics';

interface IProps {
  itemId: number;
  type: 'reply' | 'mention';
}

function InboxComment({ itemId, type }: IProps): React.JSX.Element {
  const swipesEnabled = useCommentGesturesEnabled();

  const leftOptions = useInboxReplySwipeOptions('left', type);
  const rightOptions = useInboxReplySwipeOptions('right', type);

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
  const creatorAvatar =
    type === 'reply'
      ? useReplyCreatorAvatar(itemId)
      : useMentionCreatorAvatar(itemId);
  const creatorName =
    type === 'reply'
      ? useReplyCreatorName(itemId)
      : useMentionCreatorName(itemId);
  const creatorActorId =
    type === 'reply'
      ? useReplyCreatorActorId(itemId)
      : useMentionCreatorActorId(itemId);
  const read = type === 'reply' ? useReplyRead(itemId) : useMentionRead(itemId);

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

  const [loadingPost, setLoadingPost] = useState(false);

  const onPress = useCallback(async () => {
    setLoadingPost(true);

    const res = await instance.getPost(postId ?? 0);

    setLoadingPost(false);

    addPost(res.post_view);

    navigation.push('Post', {
      replyPostId: postId,
      scrollToCommentId: itemId,
    });
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
      <SwipeableRow
        leftOption={
          swipesEnabled && leftOptions?.actions.first != null ? (
            <LeftOptions options={leftOptions} actionParams={actionParams} />
          ) : undefined
        }
        rightOption={
          swipesEnabled && rightOptions?.actions.first != null ? (
            <RightOptions options={rightOptions} actionParams={actionParams} />
          ) : undefined
        }
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
              creatorAvatar={creatorAvatar}
              userCommunity={creatorActorId}
              userName={creatorName}
              EllipsisButton={ellipsisButton}
              CommentMetrics={commentMetrics}
            />
            <CommentContent
              content={content}
              deleted={deleted}
              removed={removed}
            />
          </YStack>
          <Separator borderColor="$bg" />
        </YStack>
      </SwipeableRow>
    </YStack>
  );
}

export default React.memo(InboxComment);

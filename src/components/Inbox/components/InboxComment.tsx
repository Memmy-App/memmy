import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  addPost,
  useCommentGesturesEnabled,
  useReplyCommentId,
  useReplyContent,
  useReplyCreatorActorId,
  useReplyCreatorAvatar,
  useReplyCreatorName,
  useReplyDeleted,
  useReplyPostId,
  useReplyRemoved,
} from '@src/state';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import instance from '@src/Instance';
import { Separator, YStack } from 'tamagui';
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
}

function InboxComment({ itemId }: IProps): React.JSX.Element {
  const swipesEnabled = useCommentGesturesEnabled();

  const leftOptions = useInboxReplySwipeOptions('left');
  const rightOptions = useInboxReplySwipeOptions('right');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const replyPostId = useReplyPostId(itemId);
  const replyCommentId = useReplyCommentId(itemId);
  const replyContent = useReplyContent(itemId);
  const replyRemoved = useReplyRemoved(itemId);
  const replyDeleted = useReplyDeleted(itemId);
  const replyCreatorAvatar = useReplyCreatorAvatar(itemId);
  const replyCreatorName = useReplyCreatorName(itemId);
  const replyCreatorActorId = useReplyCreatorActorId(itemId);

  const actionParams = useMemo<SwipeableActionParams>(
    () => ({
      commentId: replyCommentId,
      replyId: itemId,
      postId: replyPostId,
      navigation,
    }),
    [itemId],
  );

  const [loadingPost, setLoadingPost] = useState(false);

  const onPress = useCallback(async () => {
    setLoadingPost(true);

    const res = await instance.getPost(replyPostId ?? 0);

    setLoadingPost(false);

    addPost(res.post_view);

    navigation.push('Post', {
      replyPostId,
      scrollToCommentId: itemId,
    });
  }, [itemId]);

  const ellipsisButton = useCallback(
    () => (
      <InboxReplyEllipsisButton itemId={itemId} commentId={replyCommentId!} />
    ),
    [itemId],
  );

  const commentMetrics = useCallback(
    () => <InboxReplyMetrics itemId={itemId} commentId={replyCommentId!} />,
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
        <YStack backgroundColor="$fg">
          <YStack my="$2" px="$2" py="$1">
            <CommentHeader
              creatorAvatar={replyCreatorAvatar}
              userCommunity={replyCreatorActorId}
              userName={replyCreatorName}
              EllipsisButton={ellipsisButton}
              CommentMetrics={commentMetrics}
            />
            <CommentContent
              content={replyContent}
              deleted={replyDeleted}
              removed={replyRemoved}
            />
          </YStack>
          <Separator borderColor="$bg" />
        </YStack>
      </SwipeableRow>
    </YStack>
  );
}

export default React.memo(InboxComment);

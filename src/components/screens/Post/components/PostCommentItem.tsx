import React, { useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import { onGenericHapticFeedback } from "@src/helpers/HapticFeedbackHelpers";
import { VoteOption } from "@src/components/common/SwipeableRow/VoteOption";
import {
  ReplyOption,
  ReplyOptionIcon,
} from "@src/components/common/SwipeableRow/ReplyOption";
import useComment from "@src/hooks/comments/useComment";
import setCollapsed from "@src/stores/posts/actions/setCollapsed";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import CommentItem from "../../../common/Comments/CommentItem";
import setPostCommentVote from "../../../../stores/posts/actions/setPostCommentVote";
import { ILemmyVote } from "../../../../types/lemmy/ILemmyVote";
import { determineVotes } from "../../../../helpers/VoteHelper";
import { usePostComment } from "../../../../stores/posts/postsStore";

interface IProps {
  commentId: number;
}

function PostCommentItem({ commentId }: IProps) {
  const { postKey } = useRoute<any>().params;
  const comment = usePostComment(postKey, commentId);
  const commentHook = useComment({ comment });

  const tapToCollapse = useSettingsStore(
    (state) => state.settings.tapToCollapse
  );

  const swipeLeftSecond = useSettingsStore(
    (state) => state.settings.commentSwipeLeftSecond
  );

  const onVote = useCallback(
    (value: ILemmyVote) => {
      const newValues = determineVotes(
        value,
        comment.comment.my_vote as ILemmyVote,
        comment.comment.counts.upvotes,
        comment.comment.counts.downvotes
      );

      setPostCommentVote(postKey, comment.comment.comment.id, newValues).then();
    },
    [comment.comment.comment.id, comment.comment.my_vote]
  );

  const onPress = useCallback(() => {
    onGenericHapticFeedback();

    if (!tapToCollapse) return;

    setCollapsed(postKey, commentId);
  }, [commentId]);

  const voteOption = useMemo(
    () => <VoteOption onVote={onVote} vote={comment.comment.my_vote} />,
    [commentId, comment.comment.my_vote]
  );

  const onSwipeLeftSecond = useCallback(() => {
    if (swipeLeftSecond === "Collapse") {
      commentHook.onCollapseChain();
    } else if (swipeLeftSecond === "Save") {
      commentHook.onSave().then();
    }
  }, [swipeLeftSecond, commentId]);

  const replyOption = useMemo(
    () => (
      <ReplyOption
        onReply={commentHook.onReply}
        extraType={
          swipeLeftSecond !== "None"
            ? (swipeLeftSecond as ReplyOptionIcon)
            : undefined
        }
        onExtra={swipeLeftSecond !== "None" ? onSwipeLeftSecond : undefined}
      />
    ),
    [commentId, comment.comment.my_vote, swipeLeftSecond]
  );

  return (
    <CommentItem
      comment={comment}
      onVote={onVote}
      onPress={onPress}
      voteOption={voteOption}
      replyOption={replyOption}
    />
  );
}

export default React.memo(PostCommentItem);

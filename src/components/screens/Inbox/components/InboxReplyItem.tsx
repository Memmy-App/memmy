import React from "react";
import CommentItem from "../../../common/Comments/CommentItem";
import { useInboxReply } from "../../../../stores/inbox/inboxStore";

interface IProps {
  commentId: number;
  unread: boolean;
  onPress: (postId: number, commentId: number) => Promise<void>;
}

function InboxReplyItem({ commentId, unread, onPress }: IProps) {
  const comment = useInboxReply(commentId);

  const onCommentPress = () => {
    const commentPathArr = comment.comment.comment.path.split(".");

    if (commentPathArr.length === 2) {
      onPress(comment.comment.post.id, comment.comment.comment.id).then();
    } else {
      onPress(
        comment.comment.post.id,
        Number(commentPathArr[commentPathArr.length - 2])
      ).then();
    }
  };

  return (
    <CommentItem
      comment={comment}
      isUnreadReply={unread}
      onPress={onCommentPress}
      depth={2}
      onVote={null}
    />
  );
}

export default React.memo(InboxReplyItem);

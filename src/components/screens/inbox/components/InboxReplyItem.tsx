import React from "react";
import { UseInbox } from "../../../../hooks/inbox/useInbox";
import ILemmyComment from "../../../../lemmy/types/ILemmyComment";
import CommentItem from "../../../common/comments/CommentItem";

interface IProps {
  inbox: UseInbox;
  item: ILemmyComment;
}

function InboxReplyItem({ inbox, item }: IProps) {
  const onPressOverride = () => {
    const commentPathArr = item.comment.comment.path.split(".");

    if (commentPathArr.length === 2) {
      inbox
        .onCommentReplyPress(item.comment.post.id, item.comment.comment.id)
        .then();
    } else {
      inbox
        .onCommentReplyPress(
          item.comment.post.id,
          Number(commentPathArr[commentPathArr.length - 2])
        )
        .then();
    }
  };

  return (
    <CommentItem
      comment={item}
      setComments={inbox.setItems}
      isReply
      isUnreadReply={inbox.topSelected === "unread"}
      onPressOverride={onPressOverride}
      depth={2}
    />
  );
}

export default React.memo(InboxReplyItem);

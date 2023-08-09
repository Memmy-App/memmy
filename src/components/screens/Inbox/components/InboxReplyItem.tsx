import React, { useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useComment from "@src/hooks/comments/useComment";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { addPost } from "@src/stores/posts/actions";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import { ReplyOption } from "@src/components/common/SwipeableRow/ReplyOption";
import { useInboxReply } from "../../../../stores/inbox/inboxStore";
import CommentItem from "../../../common/Comments/CommentItem";

interface IProps {
  commentId: number;
  unread: boolean;
}

function InboxReplyItem({ commentId, unread }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const comment = useInboxReply(commentId);
  const commentHook = useComment({ comment });

  const onPress = useCallback(async () => {
    try {
      const res = await lemmyInstance.getPost({
        auth: lemmyAuthToken,
        id: comment.comment.post.id,
      });

      const postKey =
        Date.now().toString() + comment.comment.post.id.toString();

      addPost(postKey, res.post_view, {
        initialCommentId: comment.comment.comment.id,
      });

      navigation.push("Post", { postKey });
    } catch (e) {
      handleLemmyError(e.toString());
    }
  }, [comment]);

  const replyOption = useMemo(
    () => (
      <ReplyOption
        onReply={commentHook.onReply}
        extraType={unread ? "read" : undefined}
        onExtra={unread ? commentHook.onReadPress : undefined}
      />
    ),
    [comment.comment.comment.id]
  );

  return (
    <CommentItem
      comment={comment}
      depth={1}
      onPress={onPress}
      replyOption={replyOption}
      showDivider={false}
    />
  );
}

export default React.memo(InboxReplyItem);

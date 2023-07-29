import React, { useCallback, useMemo } from "react";
import CommentItem from "@src/components/common/Comments/CommentItem";
import ILemmyComment from "@src/types/lemmy/ILemmyComment";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import { addPost } from "@src/stores/posts/actions";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReplyOption } from "@src/components/common/SwipeableRow/ReplyOption";
import useComment from "@src/hooks/comments/useComment";

interface IProps {
  comment: ILemmyComment;
}

function ProfileCommentItem({ comment }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
    () => <ReplyOption onReply={commentHook.onReply} />,
    [comment.comment.comment.id]
  );

  return (
    <CommentItem
      comment={comment}
      depth={2}
      onPress={onPress}
      replyOption={replyOption}
    />
  );
}

export default React.memo(ProfileCommentItem);

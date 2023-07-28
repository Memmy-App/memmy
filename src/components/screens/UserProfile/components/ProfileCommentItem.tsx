import React, { useCallback } from "react";
import CommentItem from "@src/components/common/Comments/CommentItem";
import ILemmyComment from "@src/types/lemmy/ILemmyComment";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import { addPost } from "@src/stores/posts/actions";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface IProps {
  comment: ILemmyComment;
}

function ProfileCommentItem({ comment }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(async () => {
    try {
      const res = await lemmyInstance.getPost({
        auth: lemmyAuthToken,
        id: comment.comment.post.id,
      });

      const postKey =
        Date.now().toString() + comment.comment.post.id.toString();

      addPost(postKey, res.post_view, {
        initialCommentId: comment.comment.post.id,
      });

      navigation.push("Post", { postKey });
    } catch (e) {
      handleLemmyError(e.toString());
    }
  }, [comment]);

  return <CommentItem comment={comment} depth={2} onPress={onPress} />;
}

export default React.memo(ProfileCommentItem);

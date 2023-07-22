import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../store";
import { selectNewComment } from "../../slices/comments/newCommentSlice";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { useUpdatesStore } from "../../stores/updates/updatesStore";

const useNewComment = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { responseTo } = useAppSelector(selectNewComment);

  const doSubmit = async () => {
    if (!content) {
      return;
    }

    try {
      setLoading(true);

      const res = await lemmyInstance.createComment({
        auth: lemmyAuthToken,
        content,
        post_id: responseTo.post
          ? responseTo.post.post.id
          : responseTo.comment.post.id,
        parent_id: responseTo.comment
          ? responseTo.comment.comment.id
          : undefined,
        language_id:
          responseTo.languageId === 0 ? undefined : responseTo.languageId,
      });

      useUpdatesStore
        .getState()
        .setNewComment(res.comment_view, !!responseTo.post);

      navigation.pop();
    } catch (e) {
      setLoading(false);

      handleLemmyError(e.toString());
    }
  };

  return {
    content,
    loading,
    doSubmit,
    setContent,
  };
};

export default useNewComment;

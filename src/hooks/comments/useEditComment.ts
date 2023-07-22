import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { SetStateAction, useState } from "react";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { useUpdatesStore } from "../../stores/updates/updatesStore";

interface UseEditComment {
  content: string;
  loading: boolean;

  setContent: React.Dispatch<SetStateAction<string>>;

  doSubmit: () => Promise<void>;
}

const useEditComment = (
  commentId?: number,
  initialContent?: string,
  languageId?: number
): UseEditComment => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const doSubmit = async () => {
    if (!content) {
      return;
    }

    try {
      setLoading(true);

      await lemmyInstance.editComment({
        auth: lemmyAuthToken,
        content,
        comment_id: commentId,
        language_id: languageId,
      });

      useUpdatesStore.getState().setEditedComment(commentId, content);

      navigation.pop();
    } catch (e) {
      setLoading(false);

      handleLemmyError(e.toString());
    }
  };

  return {
    loading,
    content,
    doSubmit,
    setContent,
  };
};

export default useEditComment;

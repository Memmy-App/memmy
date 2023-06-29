import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { SetStateAction, useState } from "react";
import { Alert } from "react-native";
import { writeToLog } from "../../../helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";

interface UseEditComment {
  content: string;
  loading: boolean;

  setContent: React.Dispatch<SetStateAction<string>>;

  doSubmit: () => Promise<void>;
}

const useEditComment = (
  commentId: number,
  initialContent: string,
  languageId: number
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

      navigation.pop();
    } catch (e) {
      writeToLog("Error editing comment.");
      writeToLog(e.toString());

      setLoading(false);

      if (e.toString() === "rate_limit_error") {
        Alert.alert("Error", "Rate limit error. Please try again shortly...");
        return;
      }

      Alert.alert("Error", e.toString());
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

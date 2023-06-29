import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert } from "react-native";
import { writeToLog } from "../../../helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { selectEditComment } from "../../../slices/comments/editCommentSlice";
import { useAppSelector } from "../../../store";

const useEditComment = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    commentId,
    content: stateContent,
    languageId,
  } = useAppSelector(selectEditComment);

  const doSubmit = async () => {
    if (!content) {
      return;
    }

    try {
      setLoading(true);

      await lemmyInstance.editComment({
        auth: lemmyAuthToken,
        content: stateContent,
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
    content,
    loading,
    doSubmit,
    setContent,
  };
};

export default useEditComment;

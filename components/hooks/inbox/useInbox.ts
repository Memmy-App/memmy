import { SetStateAction, useEffect, useState } from "react";
import {
  CommentReplyView,
  PersonMentionView,
  PrivateMessageView,
} from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppDispatch } from "../../../store";
import { setPost } from "../../../slices/post/postSlice";

interface UseInbox {
  doLoad: (type: string, unread: boolean) => void;

  loading: boolean;
  error: boolean;
  refreshing: boolean;

  replies: CommentReplyView[];
  mentions: PersonMentionView[];
  messages: PrivateMessageView[];

  selected: "replies" | "mentions" | "message";
  setSelected: React.Dispatch<
    SetStateAction<"replies" | "mentions" | "message">
  >;

  onCommentReplyPress: (
    postId: number,
    commentId: number | undefined
  ) => Promise<void>;
}

const useInbox = (): UseInbox => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [replies, setReplies] = useState<CommentReplyView[]>(null);
  const [mentions, setMentions] = useState<PersonMentionView[]>(null);
  const [messages, setMessages] = useState<PrivateMessageView[]>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selected, setSelected] = useState<"replies" | "mentions" | "message">(
    "replies"
  );

  useEffect(() => {
    doLoad("replies", true);
  }, []);

  const onCommentReplyPress = async (
    postId: number,
    commentId: number | undefined = undefined
  ) => {
    setLoading(true);

    try {
      const res = await lemmyInstance.getPost({
        auth: lemmyAuthToken,
        id: postId,
      });

      dispatch(setPost(res.post_view));
      setLoading(false);

      navigation.push("Post", {
        commentId: commentId.toString(),
      });
    } catch (e) {
      writeToLog("Failed to get post for comment push.");
      writeToLog(e.toString());

      setLoading(false);
      setError(true);
    }
  };

  const doLoad = (
    type: string,
    refresh: boolean = false,
    unread: boolean = true
  ) => {
    setLoading(true);
    setRefreshing(refresh);

    switch (type) {
      case "replies":
        return doLoadReplies(unread);
      case "mentions":
        return doLoadMentions(unread);
      case "message":
        return doLoadMessage(unread);
      default:
        return doLoadReplies(true);
    }
  };

  const doLoadReplies = async (unread: boolean) => {
    try {
      const res = await lemmyInstance.getReplies({
        auth: lemmyAuthToken,
        limit: 50,
        unread_only: unread,
      });

      setReplies(res.replies);
    } catch (e) {
      writeToLog("Error getting replies.");
      writeToLog(e.toString());
    }

    setLoading(false);
    setRefreshing(false);
  };

  const doLoadMentions = async (unread: boolean) => {
    try {
      const res = await lemmyInstance.getPersonMentions({
        auth: lemmyAuthToken,
        limit: 50,
        unread_only: unread,
      });

      setMentions(res.mentions);
    } catch (e) {
      writeToLog("Error getting mentions.");
      writeToLog(e.toString());
    }

    setLoading(false);
  };

  const doLoadMessage = async (unread: boolean) => {
    try {
      const res = await lemmyInstance.getPrivateMessages({
        auth: lemmyAuthToken,
        limit: 50,
        unread_only: unread,
      });

      setMessages(res.private_messages);
    } catch (e) {
      writeToLog("Error getting messages.");
      writeToLog(e.toString());
    }

    setLoading(false);
  };

  return {
    doLoad,

    replies,
    mentions,
    messages,

    selected,
    setSelected,

    loading,
    error,
    refreshing,

    onCommentReplyPress,
  };
};

export default useInbox;

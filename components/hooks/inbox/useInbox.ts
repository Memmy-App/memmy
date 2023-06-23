import { SetStateAction, useEffect, useState } from "react";
import {
  CommentReplyView,
  PersonMentionView,
  PrivateMessageView,
} from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";

interface UseInbox {
  doLoad: (type: string, unread: boolean) => void;

  loading: boolean;
  error: boolean;

  replies: CommentReplyView[];
  mentions: PersonMentionView[];
  messages: PrivateMessageView[];

  selected: "replies" | "mentions" | "message";
  setSelected: React.Dispatch<
    SetStateAction<"replies" | "mentions" | "message">
  >;
}

const useInbox = (): UseInbox => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [replies, setReplies] = useState<CommentReplyView[]>(null);
  const [mentions, setMentions] = useState<PersonMentionView[]>(null);
  const [messages, setMessages] = useState<PrivateMessageView[]>(null);

  const [selected, setSelected] = useState<"replies" | "mentions" | "message">(
    "replies"
  );

  useEffect(() => {
    doLoad("replies", true);
  }, []);

  const doLoad = (type: string, unread: boolean) => {
    setLoading(true);

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
  };
};

export default useInbox;

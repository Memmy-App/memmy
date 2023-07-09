import React, { SetStateAction, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";
import { useAppDispatch } from "../../../store";
import { setPost } from "../../slices/post/postSlice";
import ILemmyComment from "../../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { setUnread } from "../../slices/site/siteSlice";

export interface UseInbox {
  doLoad: (refresh: boolean) => void;
  doReadAll: () => Promise<void>;

  loading: boolean;
  error: boolean;
  refreshing: boolean;

  items: ILemmyComment[];
  setItems: React.Dispatch<SetStateAction<ILemmyComment[]>>;

  topSelected: "unread" | "all";
  setTopSelected: React.Dispatch<"unread" | "all">;

  bottomSelected: "replies" | "mentions" | "messages";
  setBottomSelected: React.Dispatch<
    SetStateAction<"replies" | "mentions" | "messages">
  >;

  onCommentReplyPress: (postId: number, commentId: number) => Promise<void>;
}

const useInbox = (): UseInbox => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [items, setItems] = useState<ILemmyComment[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [topSelected, setTopSelected] = useState<"all" | "unread">("unread");
  const [bottomSelected, setBottomSelected] = useState<
    "replies" | "mentions" | "messages"
  >("replies");

  useEffect(() => {
    doLoad().then();
  }, [topSelected, bottomSelected]);

  const onCommentReplyPress = async (postId: number, commentId: number) => {
    setLoading(true);

    try {
      const res = await lemmyInstance!.getPost({
        auth: lemmyAuthToken,
        id: postId,
      });

      dispatch(setPost(res.post_view));
      setLoading(false);

      navigation.push("Post", {
        commentId: commentId.toString(),
        showLoadAll: true,
      });
    } catch (e: any) {
      writeToLog("Failed to get Post for comment push.");
      writeToLog(e.toString());

      setLoading(false);
      setError(true);
    }
  };

  const doLoad = (refresh = false) => {
    setRefreshing(refresh);
    setLoading(!refresh);

    switch (bottomSelected) {
      case "replies":
        return doLoadReplies();
      case "mentions":
        return doLoadMentions(topSelected === "unread");
      case "messages":
        return doLoadMessage(topSelected === "unread");
      default:
        return doLoadReplies();
    }
  };

  const doLoadReplies = async () => {
    try {
      const res = await lemmyInstance!.getReplies({
        auth: lemmyAuthToken!,
        limit: 50,
        unread_only: topSelected === "unread",
      });

      const betterComments: ILemmyComment[] = [];

      for (const item of res.replies) {
        betterComments.push({
          comment: item,
          hidden: false,
          collapsed: false,
          myVote: item.my_vote as ILemmyVote,
        });
      }

      setItems(betterComments);
    } catch (e: any) {
      writeToLog("Error getting replies.");
      writeToLog(e.toString());
    }

    setLoading(false);
    setRefreshing(false);
  };

  const doLoadMentions = async (unread: boolean) => {
    try {
      await lemmyInstance!.getPersonMentions({
        auth: lemmyAuthToken!,
        limit: 50,
        unread_only: unread,
      });

      // setItems(res.mentions);
    } catch (e: any) {
      writeToLog("Error getting mentions.");
      writeToLog(e.toString());
    }

    setLoading(false);
  };

  const doLoadMessage = async (unread: boolean) => {
    try {
      await lemmyInstance!.getPrivateMessages({
        auth: lemmyAuthToken!,
        limit: 50,
        unread_only: unread,
      });

      // setItems(res.private_messages);
    } catch (e: any) {
      writeToLog("Error getting messages.");
      writeToLog(e.toString());
    }

    setLoading(false);
  };

  const doReadAll = async () => {
    setLoading(true);

    try {
      await lemmyInstance!.markAllAsRead({
        auth: lemmyAuthToken!,
      });

      if (topSelected === "unread") {
        setItems([]);
      }

      dispatch(setUnread({ type: "all", amount: 0 }));

      setLoading(false);
    } catch (e: any) {
      writeToLog("Error marking all read.");
      writeToLog(e.toString());
    }
  };

  return {
    doLoad,
    doReadAll,

    items,
    setItems,

    topSelected,
    setTopSelected,

    bottomSelected,
    setBottomSelected,

    loading,
    error,
    refreshing,

    onCommentReplyPress,
  };
};

export default useInbox;

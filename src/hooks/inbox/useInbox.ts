import React, { SetStateAction, useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { useAppDispatch } from "../../../store";
import { setUnread } from "../../slices/site/siteSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import loadInboxReplies from "../../stores/inbox/actions/loadInboxReplies";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";
import { addPost } from "../../stores/posts/actions";

export interface UseInbox {
  doLoad: () => void;
  doReadAll: () => Promise<void>;

  inboxLoading: boolean;

  topSelected: "unread" | "all";
  setTopSelected: React.Dispatch<"unread" | "all">;

  bottomSelected: "replies" | "mentions" | "messages";
  setBottomSelected: React.Dispatch<
    SetStateAction<"replies" | "mentions" | "messages">
  >;

  onCommentReplyPress: (
    postId: number,
    commentId: number | undefined
  ) => Promise<void>;
}

const useInbox = (): UseInbox => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [inboxLoading, setInboxLoading] = useState(false);

  const [topSelected, setTopSelected] = useState<"all" | "unread">("unread");
  const [bottomSelected, setBottomSelected] = useState<
    "replies" | "mentions" | "messages"
  >("replies");

  const onCommentReplyPress = async (
    postId: number,
    commentId: number | undefined = undefined
  ) => {
    setInboxLoading(true);

    try {
      const res = await lemmyInstance.getPost({
        auth: lemmyAuthToken,
        id: postId,
      });

      setInboxLoading(false);

      const key = `${Date.now()}${res.post_view.post.id}`;

      addPost(key, res.post_view);

      navigation.push("Post", {
        postKey: key,
        commentId: commentId.toString(),
        showLoadAll: true,
      });
    } catch (e) {
      setInboxLoading(true);
      handleLemmyError(e.toString());
    }
  };

  const doLoad = () => {
    loadInboxReplies().then();
  };

  const doReadAll = useCallback(async () => {
    onGenericHapticFeedback();

    try {
      await lemmyInstance
        .markAllAsRead({
          auth: lemmyAuthToken,
        })
        .then(() => {
          doLoad();
        });

      dispatch(setUnread({ type: "all", amount: 0 }));
    } catch (e) {
      handleLemmyError(e.toString());
    }
  }, []);

  return {
    doLoad,
    doReadAll,

    inboxLoading,

    topSelected,
    setTopSelected,

    bottomSelected,
    setBottomSelected,

    onCommentReplyPress,
  };
};

export default useInbox;

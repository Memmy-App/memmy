import React, { SetStateAction, useCallback, useState } from "react";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { useAppDispatch } from "../../../store";
import { setUnread } from "../../slices/site/siteSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import loadInboxReplies from "../../stores/inbox/actions/loadInboxReplies";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";

export interface UseInbox {
  doLoad: () => void;
  doReadAll: () => Promise<void>;

  topSelected: "unread" | "all";
  setTopSelected: React.Dispatch<"unread" | "all">;

  bottomSelected: "replies" | "mentions" | "messages";
  setBottomSelected: React.Dispatch<
    SetStateAction<"replies" | "mentions" | "messages">
  >;
}

const useInbox = (): UseInbox => {
  const dispatch = useAppDispatch();

  const [topSelected, setTopSelected] = useState<"all" | "unread">("unread");
  const [bottomSelected, setBottomSelected] = useState<
    "replies" | "mentions" | "messages"
  >("replies");

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

    topSelected,
    setTopSelected,

    bottomSelected,
    setBottomSelected,
  };
};

export default useInbox;

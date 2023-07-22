import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

interface InboxStore {
  replies: ILemmyComment[];

  status: {
    loading: boolean;
    error: boolean;
    refreshing: boolean;
  };
}

export const useInboxStore = create(
  immer<InboxStore>(() => ({
    replies: [],

    status: {
      loading: true,
      error: false,
      refreshing: false,
    },
  }))
);
export const useInboxReply = (commentId: number) =>
  useInboxStore((state) =>
    state.replies.find((c) => c.comment.comment.id === commentId)
  );

export const useInboxReplies = () => useInboxStore((state) => state.replies);
export const useInboxStatus = () => useInboxStore((state) => state.status);

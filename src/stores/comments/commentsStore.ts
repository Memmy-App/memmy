import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

interface CommentsStore {
  commentGroups: Map<string, CommentsState>;
}

interface CommentsState {
  comments: Map<number, ILemmyComment>;
  commentsLoading: boolean;
  commentsError: boolean;
}

export const useCommentsStore = create(
  immer<CommentsStore>(() => ({
    commentGroups: new Map<string, CommentsState>(),
  }))
);

export const useCommentsState = (screenKey: string) =>
  useCommentsStore((state) => state.commentGroups.get(screenKey));

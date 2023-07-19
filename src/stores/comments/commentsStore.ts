import { create } from "zustand";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

interface CommentsStore {
  commentGroups: Map<string, CommentsState>;
}

interface CommentsState {
  comments: Map<number, ILemmyComment>;
  commentsLoading: boolean;
  commentsError: boolean;
}

export const useCommentsStore = create<CommentsStore>()(() => ({
  commentGroups: new Map<string, CommentsState>(),
}));

export const useCommentsState = (screenKey: string) =>
  useCommentsStore((state) => state.commentGroups.get(screenKey));

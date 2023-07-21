import { create } from "zustand";
import { CommentView } from "lemmy-js-client";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";

interface UpdatesState {
  voted: {
    postId: number;
    value: ILemmyVote;
  } | null;

  saved: {
    postId: number;
    saved: boolean;
  } | null;

  newComment: {
    comment: CommentView;
    isTop: boolean;
  } | null;

  editedComment: {
    commentId: number;
    content: string;
  } | null;
}

interface Actions {
  setVoted: (postId: number, value: ILemmyVote) => void;
  clearVoted: () => void;

  setSaved: (postId: number, saved: boolean) => void;
  clearSaved: () => void;

  setNewComment: (comment: CommentView, isTop: boolean) => void;
  clearNewComment: () => void;

  setEditedComment: (commentId: number, content: string) => void;
  clearEditedComment: () => void;
}

export const useUpdatesStore = create<UpdatesState & Actions>()((set) => ({
  voted: null,
  saved: null,
  newComment: null,
  editedComment: null,

  setVoted: (postId: number, value: ILemmyVote) =>
    set((state) => ({
      ...state,
      voted: {
        postId,
        value,
      },
    })),
  clearVoted: () =>
    set((state) => ({
      ...state,
      voted: null,
    })),

  setSaved: (postId: number, saved: boolean) =>
    set((state) => ({
      ...state,
      saved: {
        postId,
        saved,
      },
    })),
  clearSaved: () =>
    set((state) => ({
      ...state,
      saved: null,
    })),

  setNewComment: (comment: CommentView, isTop: boolean) =>
    set((state) => ({
      ...state,
      newComment: {
        comment,
        isTop,
      },
    })),
  clearNewComment: () =>
    set((state) => ({
      ...state,
      newComment: null,
    })),

  setEditedComment: (commentId: number, content: string) =>
    set((state) => ({
      ...state,
      editedComment: {
        commentId,
        content,
      },
    })),

  clearEditedComment: () =>
    set((state) => ({
      ...state,
      editedComment: null,
    })),
}));

export const useVoted = () => useUpdatesStore((state) => state.voted);
export const useSaved = () => useUpdatesStore((state) => state.saved);
export const useNewComment = () => useUpdatesStore((state) => state.newComment);
export const useEditedComment = () =>
  useUpdatesStore((state) => state.editedComment);

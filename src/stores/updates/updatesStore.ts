import { create } from "zustand";
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
}

interface Actions {
  setVoted: (postId: number, value: ILemmyVote) => void;
  clearVoted: () => void;

  setSaved: (postId: number, saved: boolean) => void;
  clearSaved: () => void;
}

export const useUpdatesStore = create<UpdatesState & Actions>()((set) => ({
  voted: null,
  saved: null,

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
}));

export const useVoted = () => useUpdatesStore((state) => state.voted);
export const useSaved = () => useUpdatesStore((state) => state.saved);

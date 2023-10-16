import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface AppStore {
  newPostId?: number;
  newCommentId?: number;
}

export const useAppStore = create(
  immer<AppStore>((set) => ({
    newPostId: undefined,
    newCommentId: undefined,
  })),
);

export const useNewPostId = (): number | undefined =>
  useAppStore((state) => state.newPostId);

export const useNewCommentId = (): number | undefined =>
  useAppStore((state) => state.newCommentId);

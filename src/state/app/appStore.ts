import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface AppStore {
  newPostId?: number;
  newCommentId?: number;
  lastFeedPress: number;
}

export const useAppStore = create(
  immer<AppStore>((set) => ({
    newPostId: undefined,
    newCommentId: undefined,
    lastFeedPress: 0,
  })),
);

export const useNewPostId = (): number | undefined =>
  useAppStore((state) => state.newPostId);

export const useNewCommentId = (): number | undefined =>
  useAppStore((state) => state.newCommentId);

export const useLastHomePress = (): number =>
  useAppStore((state) => state.lastFeedPress);

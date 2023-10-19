import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';
import { IToast } from '@src/types/IToast';

interface AppStore {
  newPostId?: number;
  newCommentId?: number;
  lastFeedPress: number;
  toast: IToast | null;
  drawerOpen: boolean;
}

export const useAppStore = create(
  immer<AppStore>((set) => ({
    newPostId: undefined,
    newCommentId: undefined,
    lastFeedPress: 0,
    toast: null,
    drawerOpen: false,
  })),
);

export const useNewPostId = (): number | undefined =>
  useAppStore((state) => state.newPostId);

export const useNewCommentId = (): number | undefined =>
  useAppStore((state) => state.newCommentId);

export const useLastHomePress = (): number =>
  useAppStore((state) => state.lastFeedPress);

export const useToast = (): IToast | null =>
  useAppStore((state) => state.toast);

export const useDrawerOpen = (): boolean =>
  useAppStore((state) => state.drawerOpen);

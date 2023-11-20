import { PostView } from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UserSelector is account.fullUsername.
// Also for some reason creating a store with Map field in zustand does not work:
// the Map turns into an object. So we'll use object instead of Map.
type UserSelector = string;
interface HistoryStore {
  userScoped: Record<
    UserSelector,
    {
      // These two linters contradict here.
      // eslint-disable-next-line @typescript-eslint/member-delimiter-style, prettier/prettier
      recentPosts: PostView[],
    }
  >;
  reset: () => void;
}

const initialState: Partial<HistoryStore> = {
  userScoped: {},
};

export const useHistoryStore = create(
  persist(
    immer<HistoryStore>((set) => ({
      // userScoped: new Map(),
      userScoped: {},
      reset: () => {
        set((state) => ({
          // ...state,
          ...initialState,
        }));
      },
    })),
    {
      name: 'history',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

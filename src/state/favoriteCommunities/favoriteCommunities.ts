import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/esm/middleware';

interface FavoriteCommunitiesStore {
  favoriteLists: Record<string, number[]>;

  reset: () => void;
}

const initialState: Partial<FavoriteCommunitiesStore> = {
  favoriteLists: {},
};

export const useFavoriteCommunitiesStore = create(
  persist(
    immer<FavoriteCommunitiesStore>((set) => ({
      favoriteLists: {},

      reset: () => {
        set((state) => ({
          ...state,
          ...initialState,
        }));
      },
    })),
    {
      name: 'favoriteCommunities',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useAccountFavorites = (
  accountFullName: string,
): number[] | undefined =>
  useFavoriteCommunitiesStore((state) => state.favoriteLists[accountFullName]);

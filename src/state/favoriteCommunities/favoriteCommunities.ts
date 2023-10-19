import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/esm/middleware';

interface FavoriteCommunitiesStore {
  favoriteLists: Map<string, number[]>;
}

export const useFavoriteCommunities = create(
  persist(
    immer<FavoriteCommunitiesStore>(() => ({
      favoriteLists: new Map<string, number[]>(),
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
  useFavoriteCommunities((state) => state.favoriteLists.get(accountFullName));

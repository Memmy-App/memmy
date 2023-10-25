import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/esm/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterStore {
  instanceFilters: string[];
  keywordFilters: string[];
}

export const useFilterStore = create(
  persist(
    immer<FilterStore>(() => ({
      instanceFilters: [],
      keywordFilters: [],
    })),
    {
      name: 'filters',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useInstanceFilters = (): string[] =>
  useFilterStore((state) => state.instanceFilters);

export const useKeywordFilters = (): string[] =>
  useFilterStore((state) => state.keywordFilters);

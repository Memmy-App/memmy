import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface FiltersStore {
  keywords: string[];
  instances: string[];

  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;

  addInstance: (instance: string) => void;
  removeInstance: (instance: string) => void;
}

export const useFiltersStore = create(
  persist(
    immer<FiltersStore>((set) => ({
      keywords: [],
      instances: [],

      addKeyword: (keyword: string) => {
        set((state) => {
          state.keywords.push(keyword);
        });
      },
      removeKeyword: (keyword: string) => {
        set((state) => {
          state.keywords = state.keywords.filter((k) => k !== keyword);
        });
      },

      addInstance: (keyword: string) => {
        set((state) => {
          state.instances.push(keyword);
        });
      },
      removeInstance: (keyword: string) => {
        set((state) => {
          state.instances = state.instances.filter((i) => i !== keyword);
        });
      },
    })),
    {
      name: "filters",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useKeywordFilter = (): string[] =>
  useFiltersStore((state) => state.keywords);
export const useInstancesFilter = (): string[] =>
  useFiltersStore((state) => state.instances);

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { writeToLog } from "@src/helpers/LogHelper";

export type FilterStoreType = "keyword" | "instance";

interface FiltersStore {
  keywords: string[];
  instances: string[];

  init: () => Promise<void>;

  addKeyword: (keyword: string) => Promise<void>;
  removeKeyword: (keyword: string) => Promise<void>;

  addInstance: (instance: string) => Promise<void>;
  removeInstance: (instance: string) => Promise<void>;
}

export const useFiltersStore = create(
  immer<FiltersStore>((set, get) => ({
    keywords: [],
    instances: [],

    init: async () => {
      try {
        const keywordsStr = await AsyncStorage.getItem("@KeywordFilters");
        set((state) => {
          state.keywords = [...state.keywords, ...JSON.parse(keywordsStr)];
        });

        const instancesStr = await AsyncStorage.getItem("@InstanceFilters");
        set((state) => {
          state.instances = [...state.instances, ...JSON.parse(instancesStr)];
        });
      } catch (e) {
        writeToLog("Error getting Keywords");
        writeToLog(e.toString());
      }
    },

    addKeyword: async (keyword: string) => {
      const current = get().keywords;

      try {
        await AsyncStorage.setItem(
          "@KeywordFilters",
          JSON.stringify([...current, keyword])
        );

        set((state) => {
          state.keywords = [...state.keywords, keyword];
        });
      } catch (e) {
        writeToLog("Error adding Keyword");
        writeToLog(e.toString());
      }
    },

    removeKeyword: async (keyword: string) => {
      const newArr = get().keywords.filter((k) => k !== keyword);

      try {
        await AsyncStorage.setItem("@KeywordFilters", JSON.stringify(newArr));

        set((state) => {
          state.keywords = state.keywords.filter((k) => k !== keyword);
        });
      } catch (e) {
        writeToLog("Error removing Keyword");
        writeToLog(e.toString());
      }
    },

    addInstance: async (instance: string) => {
      const current = get().instances;

      try {
        await AsyncStorage.setItem(
          "@InstanceFilters",
          JSON.stringify([...current, instance])
        );

        set((state) => {
          state.instances = [...state.instances, instance];
        });
      } catch (e) {
        writeToLog("Error adding Instance");
        writeToLog(e.toString());
      }
    },

    removeInstance: async (instance: string) => {
      const newArr = get().instances.filter((k) => k !== instance);

      try {
        await AsyncStorage.setItem("@InstanceFilters", JSON.stringify(newArr));

        set((state) => {
          state.instances = state.instances.filter((k) => k !== instance);
        });
      } catch (e) {
        writeToLog("Error removing Instance");
        writeToLog(e.toString());
      }
    },
  }))
);

export const useFilterStoreType = (type: FilterStoreType) => {
  switch (type) {
    case "keyword":
      return useKeywordFilter();
    case "instance":
      return useInstancesFilter();
    default:
      throw new Error(`Unknown filter store type${type}`);
  }
};

export const useKeywordFilter = () =>
  useFiltersStore((state) => state.keywords);

export const useInstancesFilter = () =>
  useFiltersStore((state) => state.instances);

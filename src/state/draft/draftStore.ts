import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/esm/middleware';
import { IAccount } from '@src/types';

export interface DraftState {
  account: IAccount;
  forPost?: number;
  forComment?: number;
  forCommunity?: number;
  title?: string;
  content?: string;
}

interface DraftStore {
  commentDrafts: DraftState[];
  postDrafts: DraftState[];

  reset: () => void;
}

const initialState: Partial<DraftStore> = {
  commentDrafts: [],
  postDrafts: [],
};

export const useDraftStore = create(
  persist(
    immer<DraftStore>((set) => ({
      commentDrafts: [],
      postDrafts: [],

      reset: () => {
        set((state) => ({
          ...state,
          ...initialState,
        }));
      },
    })),
    {
      name: 'drafts',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

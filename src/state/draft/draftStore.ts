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
}

export const useDraftStore = create(
  persist(
    immer<DraftStore>((get, set) => ({
      commentDrafts: [],
      postDrafts: [],
    })),
    {
      name: 'drafts',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

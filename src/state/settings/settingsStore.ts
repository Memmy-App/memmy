import { IPostGestureOption } from '@src/types/IPostGestureOption';
import { CommentSortType, ListingType, SortType } from 'lemmy-js-client';
import { IThemeOption } from '@src/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsStore {
  gestures: {
    post: {
      enabled: boolean,
      shortRight: IPostGestureOption,
      longRight: IPostGestureOption,
      shortLeft: IPostGestureOption,
      longLeft: IPostGestureOption,
    },
    comment: {
      enabled: boolean,
      collapse: boolean,
      shortRight: IPostGestureOption,
      longRight: IPostGestureOption,
      shortLeft: IPostGestureOption,
      longLeft: IPostGestureOption,
    },
  };

  imagesInFeed: boolean;

  defaultSort: SortType;
  defaultCommentSort: CommentSortType;
  defaultListingType: ListingType;

  showInstanceForUsernames: boolean;
  blurNsfw: boolean;

  viewType: 'full' | 'compact';

  theme: IThemeOption;
  themeLight: IThemeOption;
  themeDark: IThemeOption;

  themeMatchSystem: boolean;

  fontSize: number;

  postTitleWeight: number;

  compactOptions: {
    thumbnailPosition: 'left' | 'right' | 'none',
    showVoteButtons: boolean,
  };

  readOptions: {
    onPostView: boolean,
    onImageView: boolean,
    onVote: boolean,
    onFeedScroll: boolean,
    onCommunityScroll: boolean,

    hideReadPostsFeed: boolean,
    hideReadPostsCommunity: boolean,
  };

  imagesIgnoreScreenHeight: boolean;

  totalScore: boolean;

  readerMode: boolean;

  appIcon: string;

  useDefaultBrowser: boolean;

  hideUsernameInTab: boolean;
  hideAvatarInTab: boolean;

  commentJumpButton: boolean;
}

const initialState: SettingsStore = {
  gestures: {
    post: {
      enabled: true,

      shortLeft: 'upvote',
      longLeft: 'downvote',

      shortRight: 'save',
      longRight: 'reply',
    },
    comment: {
      enabled: true,
      collapse: true,

      shortLeft: 'upvote',
      longLeft: 'downvote',

      shortRight: 'save',
      longRight: 'reply',
    },
  },

  imagesInFeed: true,

  defaultSort: 'Hot',
  defaultCommentSort: 'Top',
  defaultListingType: 'All',

  showInstanceForUsernames: true,
  blurNsfw: true,

  viewType: 'full',

  theme: 'lightTheme',
  themeLight: 'lightTheme',
  themeDark: 'darkTheme',

  themeMatchSystem: false,

  fontSize: 16,

  postTitleWeight: 600,

  compactOptions: {
    thumbnailPosition: 'left',
    showVoteButtons: true,
  },

  readOptions: {
    onPostView: true,
    onImageView: true,
    onVote: true,
    onFeedScroll: false,
    onCommunityScroll: false,

    hideReadPostsFeed: false,
    hideReadPostsCommunity: false,
  },

  imagesIgnoreScreenHeight: false,

  totalScore: false,

  readerMode: false,

  appIcon: 'default',

  useDefaultBrowser: false,

  hideUsernameInTab: false,
  hideAvatarInTab: false,

  commentJumpButton: false,
};

export const useSettingsStore = create(
  persist(
    immer<SettingsStore>(() => ({
      ...initialState,
    })),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    }),
);

export const useSetting = <T extends keyof SettingsStore>(setting: T): string | boolean | number | object | object[] => {
  return useSettingsStore((state) => state[setting]);
};

import { IPostGestureOption } from '@src/types/IPostGestureOption';
import { CommentSortType, ListingType, SortType } from 'lemmy-js-client';
import { ICommentGestureOption, IThemeOption } from '@src/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IHapticStrengthOption } from '@src/types/options';

export interface IGesturePostSettings {
  enabled: boolean;
  firstRight: IPostGestureOption;
  secondRight: IPostGestureOption;
  firstLeft: IPostGestureOption;
  secondLeft: IPostGestureOption;
}

export interface IGestureCommentSettings {
  enabled: boolean;
  collapse: boolean;
  firstRight: IPostGestureOption;
  secondRight: IPostGestureOption;
  firstLeft: IPostGestureOption;
  secondLeft: IPostGestureOption;
}

export interface IGestureSettings {
  post: IGesturePostSettings;
  comment: IGestureCommentSettings;
}

export interface ICompactOptions {
  thumbnailPosition: 'left' | 'right' | 'none';
  showVoteButtons: boolean;
}

export interface IReadOptions {
  onPostView: boolean;
  onImageView: boolean;
  onVote: boolean;
  onFeedScroll: boolean;
  onCommunityScroll: boolean;

  hideReadPostsFeed: boolean;
  hideReadPostsCommunity: boolean;
}

export interface SettingsStore {
  gestures: IGestureSettings;

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

  postTitleWeight: 'normal' | 'bold';

  compactOptions: ICompactOptions;

  readOptions: IReadOptions;

  imagesIgnoreScreenHeight: boolean;

  totalScore: boolean;

  readerMode: boolean;

  appIcon: string;

  useDefaultBrowser: boolean;

  hideUsernameInTab: boolean;
  hideAvatarInTab: boolean;

  commentJumpButton: boolean;

  hapticsEnabled: boolean;
  hapticsStrength: IHapticStrengthOption;

  showCommunityIconInFeed: boolean;
  showAvatarInFeed: boolean;
}

const initialState: SettingsStore = {
  gestures: {
    post: {
      enabled: true,

      firstLeft: 'upvote',
      secondLeft: 'downvote',

      firstRight: 'save',
      secondRight: 'reply',
    },
    comment: {
      enabled: true,
      collapse: true,

      firstLeft: 'upvote',
      secondLeft: 'downvote',

      firstRight: 'save',
      secondRight: 'reply',
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

  fontSize: 14,

  postTitleWeight: 'bold',

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

  hapticsEnabled: true,
  hapticsStrength: 'medium',

  showCommunityIconInFeed: true,
  showAvatarInFeed: true,
};

export const useSettingsStore = create(
  persist(
    immer<SettingsStore>(() => ({
      ...initialState,
    })),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useSetting = <T extends keyof SettingsStore>(
  setting: T,
): string | boolean | number | object | object[] => {
  return useSettingsStore((state) => state[setting]);
};

interface IFeedSettings {
  defaultSort: SortType;
  defaultListingType: ListingType;
}

export const useFeedSettings = (): IFeedSettings =>
  useSettingsStore((state) => ({
    defaultSort: state.defaultSort,
    defaultListingType: state.defaultListingType,
  }));

export const usePostGesturesEnabled = (): boolean =>
  useSettingsStore((state) => state.gestures.post.enabled);

export const usePostGesturesFirstRight = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.firstRight);
export const usePostGesturesFirstLeft = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.firstLeft);
export const usePostGesturesSecondRight = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.secondRight);
export const usePostGesturesSecondLeft = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.secondLeft);

export const useCommentGesturesEnabled = (): boolean =>
  useSettingsStore((state) => state.gestures.comment.enabled);

export const useCommentGesturesCollapse = (): boolean =>
  useSettingsStore((state) => state.gestures.comment.collapse);

export const useCommentGesturesFirstRight = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.firstRight);
export const useCommentGesturesFirstLeft = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.firstLeft);
export const useCommentGesturesSecondRight = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.secondRight);
export const useCommentGesturesSecondLeft = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.secondLeft);

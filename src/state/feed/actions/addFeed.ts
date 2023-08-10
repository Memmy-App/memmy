import { useSettingsStore } from "@src/state/settings/settingsStore";
import { useFeedStore } from "@src/state/feed/feedStore";

export const addFeed = (feedKey: string, communityName?: string): void => {
  const { defaultSort, defaultListingType } = useSettingsStore.getState();

  useFeedStore.setState((state) => {
    state.feeds.set(feedKey, {
      posts: [],

      status: {
        loading: true,
        error: false,
        refreshing: false,
        refresh: false,
      },

      communityName,

      sortType: defaultSort,
      listingType: defaultListingType,

      currentPage: 1,
    });
  });
};

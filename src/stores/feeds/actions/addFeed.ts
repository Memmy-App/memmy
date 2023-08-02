import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { useFeedsStore } from "../feedsStore";

const addFeed = (feedKey: string, communityName?: string) => {
  const { defaultSort, defaultListingType } =
    useSettingsStore.getState().settings;

  useFeedsStore.setState((state) => {
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

export default addFeed;

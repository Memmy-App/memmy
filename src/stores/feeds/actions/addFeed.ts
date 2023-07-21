import { useFeedsStore } from "../feedsStore";
import store from "../../../../store";

const addFeed = (feedKey: string, communityName?: string) => {
  const { defaultSort, defaultListingType } = store.getState().settings;

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

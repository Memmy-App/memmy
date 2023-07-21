import { useFeedsStore } from "../feedsStore";

const addFeed = (feedKey: string, communityName?: string) => {
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

      sortType: "TopDay", // TODO Use Default
      listingType: "All", // TODO Default

      currentPage: 1,
    });
  });
};

export default addFeed;

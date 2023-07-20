import { useFeedsStore } from "../feedsStore";

const addFeed = (feedKey: string) => {
  useFeedsStore.setState((state) => {
    state.feeds.set(feedKey, {
      posts: [],
      postsLoading: true,
      postsError: false,

      sortType: "TopDay", // TODO Use Default
    });
  });
};

export default addFeed;

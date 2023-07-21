import { useFeedsStore } from "../feedsStore";

const removeFeed = (feedKey: string) => {
  useFeedsStore.setState((state) => {
    state.feeds.delete(feedKey);
  });
};

export default removeFeed;

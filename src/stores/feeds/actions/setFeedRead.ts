import { useFeedsStore } from "../feedsStore";

const setFeedRead = (feedKey: string, postId: number) => {
  useFeedsStore.setState((state) => {
    state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).read =
      true;
  });
};

export default setFeedRead;

import { PostView } from "lemmy-js-client";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { useFeedsStore } from "../feedsStore";

const setFeedPosts = (feedKey: string, posts: PostView[]) => {
  const { hideNsfw } = useSettingsStore.getState().settings;

  if (hideNsfw) {
    posts = posts.filter((p) => !p.post.nsfw && !p.community.nsfw);
  }

  useFeedsStore.setState((state) => {
    const prev = state.feeds.get(feedKey);

    prev.posts = posts;
    prev.status.loading = false;
  });
};

export default setFeedPosts;

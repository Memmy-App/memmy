import { ListingType, SortType } from "lemmy-js-client";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { preloadImages } from "../../../helpers/ImageHelper";
import { useFiltersStore } from "../../filters/filtersStore";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface ILoadFeedOptions {
  refresh: boolean;
  communityId?: number;
  limit?: number;
  sort?: SortType;
  type?: ListingType;
}

const defaultOptions: ILoadFeedOptions = {
  refresh: false,
  limit: 50,
};

const loadFeedPosts = async (
  feedKey: string,
  loadOptions: ILoadFeedOptions
) => {
  const { hideNsfw, hideReadPostsOnFeed, hideReadPostsInCommunities } =
    useSettingsStore.getState().settings;

  const options = {
    ...defaultOptions,
    ...loadOptions,
  };

  // Get the current state of things
  const currentState = useFeedsStore.getState().feeds.get(feedKey);

  useFeedsStore.setState((state) => {
    const prev = state.feeds.get(feedKey);

    prev.status.loading = true;
    prev.status.error = false;
    prev.status.refreshing = options.refresh;
  });

  try {
    const res = await lemmyInstance.getPosts({
      auth: lemmyAuthToken,
      community_id: options.communityId,
      community_name: currentState.communityName,
      limit: options.limit,
      page: options.refresh ? 1 : currentState.currentPage + 1,
      sort: options.sort ?? currentState.sortType,
      type_: options.type ?? currentState.listingType,
    });

    if (!res.posts || res.posts.length === 0) {
      useFeedsStore.setState((state) => {
        const prev = state.feeds.get(feedKey);

        prev.status.loading = false;
      });

      return;
    }

    const { posts } = res;

    const { keywords, instances } = useFiltersStore.getState();

    const filtered = [];

    posts.forEach((p) => {
      if (hideNsfw && (p.post.nsfw || p.community.nsfw)) return;
      if (hideReadPostsOnFeed && !currentState.communityName && p.read) return;
      if (hideReadPostsInCommunities && currentState.communityName && p.read)
        return;
      if (keywords.some((i) => p.post.name.toLowerCase().includes(i))) return;
      if (instances.some((i) => getBaseUrl(p.community.actor_id).includes(i)))
        return;

      filtered.push(p);
    });

    preloadImages(filtered).then();

    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(feedKey);

      if (options.refresh || prev.posts.length === 0) {
        prev.posts = filtered;
        prev.currentPage = 1;
      } else {
        prev.posts = [...prev.posts, ...filtered];
        prev.currentPage += 1;
      }

      prev.status.loading = false;
      prev.status.refreshing = false;
    });
  } catch (e) {
    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(feedKey);

      prev.status.loading = false;
      prev.status.refreshing = false;
      prev.status.error = true;
    });
  }
};

export default loadFeedPosts;

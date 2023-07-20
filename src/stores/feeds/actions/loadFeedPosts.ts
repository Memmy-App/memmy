import { ListingType, SortType } from "lemmy-js-client";
import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { preloadImages } from "../../../helpers/ImageHelper";

interface ILoadFeedOptions {
  refresh: boolean;
  communityId?: number;
  communityName?: string;
  limit?: number;
  sort: SortType;
  type: ListingType;
}

const defaultOptions: ILoadFeedOptions = {
  refresh: false,
  limit: 50,
  sort: "Active",
  type: "All",
};

const loadFeedPosts = async (
  feedKey: string,
  loadOptions: ILoadFeedOptions
) => {
  const options = {
    ...defaultOptions,
    ...loadOptions,
  };

  // Get the current state of things
  const currentState = useFeedsStore.getState().feeds.get(feedKey);

  useFeedsStore.setState((state) => {
    const prev = state.feeds.get(feedKey);

    prev.loading = true;
    prev.error = false;
  });

  try {
    const res = await lemmyInstance.getPosts({
      auth: lemmyAuthToken,
      community_id: options.communityId,
      community_name: options.communityName,
      limit: options.limit,
      page: options.refresh ? 1 : currentState.currentPage + 1,
      sort: options.sort,
      type_: options.type,
    });

    if (!res.posts || res.posts.length === 0) {
      useFeedsStore.setState((state) => {
        const prev = state.feeds.get(feedKey);

        prev.loading = false;
      });

      return;
    }

    // TODO Deal with filtering nsfw and read posts

    preloadImages(res.posts).then();

    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(feedKey);

      if (prev.posts.length === 0) {
        prev.posts = res.posts;
        prev.currentPage = 1;
      } else {
        prev.posts = [...prev.posts, ...res.posts];
        prev.currentPage += 1;
      }

      prev.loading = false;
    });
  } catch (e) {
    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(feedKey);

      prev.loading = false;
      prev.error = true;
    });
  }
};

export default loadFeedPosts;

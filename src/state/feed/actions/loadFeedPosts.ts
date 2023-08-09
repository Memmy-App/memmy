import { ListingType, PostView, SortType } from "lemmy-js-client";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import { useFeedStore } from "@src/state/feed/feedStore";
import instance from "@src/Instance";
import { getBaseUrl } from "@src/helpers/links";
import { preloadImages } from "@src/helpers/image";
import {
  useInstancesFilter,
  useKeywordFilter,
} from "@src/state/filters/filtersStore";

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

export const loadFeedPosts = async (
  feedKey: string,
  loadOptions: ILoadFeedOptions
): Promise<void> => {
  const { hideNsfw, hideReadPostsOnFeed, hideReadPostsInCommunities } =
    useSettingsStore.getState();

  const options = {
    ...defaultOptions,
    ...loadOptions,
  };

  // Get the current state of things
  const currentState = useFeedStore.getState().feeds.get(feedKey)!;

  useFeedStore.setState((state) => {
    const prev = state.feeds.get(feedKey)!;

    prev.status.loading = true;
    prev.status.error = false;
    prev.status.refreshing = options.refresh;
  });

  try {
    const res = await instance.getPosts({
      communityId: options.communityId,
      communityName: currentState.communityName,
      limit: options.limit,
      page: options.refresh ? 1 : currentState.currentPage + 1,
      sort: options.sort ?? currentState.sortType,
      type: options.type ?? currentState.listingType,
    });

    if (!res?.posts || res.posts.length === 0) {
      useFeedStore.setState((state) => {
        const prev = state.feeds.get(feedKey)!;

        prev.status.loading = false;
      });

      return;
    }

    const { posts } = res;

    const keywordFilter = useKeywordFilter();
    const instanceFilter = useInstancesFilter();

    const filtered = posts.reduce((acc, p) => {
      if (
        !(hideNsfw && (p.post.nsfw || p.community.nsfw)) &&
        !(hideReadPostsOnFeed && !currentState.communityName && p.read) &&
        !(hideReadPostsInCommunities && currentState.communityName && p.read) &&
        !keywordFilter.some((i: string) =>
          p.post.name.toLowerCase().includes(i)
        ) &&
        !instanceFilter.some((i: string) =>
          getBaseUrl(p.community.actor_id).includes(i)
        ) &&
        // Filter out repeat posts since Lemmy gets updated constantly
        !(
          !options.refresh &&
          currentState.posts.find((i) => i.post.id === p.post.id)
        )
      ) {
        acc.push(p);
      }

      return acc;
    }, [] as PostView[]);

    preloadImages(filtered).then();

    useFeedStore.setState((state) => {
      const prev = state.feeds.get(feedKey)!;

      if (options.refresh || prev.posts.length === 0) {
        prev.posts = filtered;
        prev.currentPage = 1;
      } else {
        prev.posts = [...prev.posts, ...filtered];
        prev.currentPage = currentState.currentPage + 1;
      }

      prev.status.loading = false;
      prev.status.refreshing = false;
    });
  } catch (e) {
    useFeedStore.setState((state) => {
      const prev = state.feeds.get(feedKey)!;

      prev.status.loading = false;
      prev.status.refreshing = false;
      prev.status.error = true;
    });
  }
};

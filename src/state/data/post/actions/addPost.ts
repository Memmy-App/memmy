import { PostView } from 'lemmy-js-client';
import { PostPair, useDataStore, useFilterStore } from '@src/state';
import { getLinkType } from '@helpers/links/getLinkType';
import { truncateText } from '@helpers/text';
import { cacheImages } from '@helpers/image';
import { getBaseUrl } from '@helpers/links';

interface AddOrUpdatePostParams {
  post: PostView;
  screenId?: string;
}

export const addOrUpdatePost = ({
  post,
  screenId,
}: AddOrUpdatePostParams): void => {
  useDataStore.setState((state) => {
    const currentPost = state.posts.get(post.post.id);
    const moderated = useDataStore.getState().site?.moderatedIds;
    const userId =
      useDataStore.getState().site.site?.my_user?.local_user_view.local_user
        .person_id;

    if (currentPost != null) {
      if (screenId != null) {
        currentPost.usedBy.push(screenId);
      }

      currentPost.view.counts = post.counts;
      currentPost.view.post.body = post.post.body;
      currentPost.view.post.deleted = post.post.deleted;
      currentPost.view.post.removed = post.post.removed;
    } else {
      state.posts.set(post.post.id, {
        view: post,
        usedBy: screenId != null ? [screenId] : [],
        linkType: getLinkType(post.post.url),
        bodyPreview: truncateText(post.post.body, 200),
        moderates: moderated?.includes(post.post.community_id) ?? false,
        isOwnPost: userId === post.creator.id,
      });
    }
  });
};

interface AddPostsParams {
  posts: PostView[];
  screenId: string;
  page?: number;
  refresh?: boolean;
}

export const addPosts = ({
  posts,
  screenId,
  page = 1,
  refresh = false,
}: AddPostsParams): void => {
  const links: string[] = [];

  const postPairs: PostPair[] = [];
  const currentPosts = useDataStore.getState().feeds.get(screenId)?.postPairs;
  const moderated = useDataStore.getState().site?.moderatedIds;
  const userId =
    useDataStore.getState().site.site?.my_user?.local_user_view.local_user
      .person_id;

  const filters = useFilterStore.getState();
  const keywordPattern = new RegExp(filters.keywordFilters.join('|'), 'i');

  useDataStore.setState((state) => {
    // Add each post to the state
    for (const post of posts) {
      // Check the filters first
      if (filters.instanceFilters.includes(getBaseUrl(post.post.ap_id))) {
        continue;
      }

      if (
        filters.keywordFilters.length > 0 &&
        keywordPattern.test(post.post.name)
      ) {
        continue;
      }

      const currentPost = state.posts.get(post.post.id);
      const linkType = getLinkType(post.post.url);

      if (currentPost != null) {
        currentPost.usedBy.push(screenId);
      } else {
        state.posts.set(post.post.id, {
          view: post,
          usedBy: [screenId],
          linkType,
          bodyPreview: truncateText(post.post.body, 200),
          moderates: moderated?.includes(post.post.community_id) ?? false,
          isOwnPost: userId === post.creator.id,
        });
      }

      if (!refresh) {
        const index = currentPosts?.findIndex((p) => p.postId === post.post.id);

        if (index == null || index === -1) {
          postPairs.push({
            postId: post.post.id,
            linkType,
          });

          if (post.post.url != null) {
            links.push(post.post.url);
          }
        }
      } else {
        postPairs.push({
          postId: post.post.id,
          linkType,
        });
      }

      void cacheImages(links);
    }

    // Add the post ids to the feed
    const feed = state.feeds.get(screenId);

    if (feed == null || refresh) {
      state.feeds.set(screenId, {
        feedId: screenId,
        postPairs: [...postPairs],
        nextPage: page + 1,
      });
    } else {
      feed.postPairs = [...feed.postPairs, ...postPairs];
      feed.nextPage = page + 1;
    }
  });
};

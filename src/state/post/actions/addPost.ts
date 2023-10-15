import { PostView } from 'lemmy-js-client';
import { usePostStore } from '@src/state/post/postStore';
import { getLinkType } from '@helpers/links/getLinkType';
import { truncateText } from '@helpers/text';
import { useFeedStore } from '@src/state/feed/feedStore';
import { cacheImages } from '@helpers/image';

export const addPost = (post: PostView, screenId: string) => {
  usePostStore.setState((state) => {
    const currentPost = state.posts.get(post.post.id);

    if (currentPost != null) {
      currentPost.usedBy.push(screenId);
    } else {
      state.posts.set(post.post.id, {
        view: post,
        usedBy: [screenId],
        linkType: getLinkType(post.post.url),
        bodyPreview: truncateText(post.post.body, 200),
      });
    }
  });
};

export const addPosts = (
  posts: PostView[],
  screenId: string,
  page = 1,
  refresh = false,
): void => {
  const links: string[] = [];

  const postIds: number[] = [];
  const currentPosts = useFeedStore.getState().feeds.get(screenId)?.postIds;

  usePostStore.setState((state) => {
    // Add each post to the state
    for (const post of posts) {
      const currentPost = state.posts.get(post.post.id);

      if (currentPost != null) {
        currentPost.usedBy.push(screenId);
      } else {
        state.posts.set(post.post.id, {
          view: post,
          usedBy: [screenId],
          linkType: getLinkType(post.post.url),
          bodyPreview: truncateText(post.post.body, 200),
        });
      }

      const index = currentPosts?.indexOf(post.post.id);

      if (index === -1) {
        postIds.push(post.post.id);

        if (post.post.url != null) {
          links.push(post.post.url);
        }
      }

      void cacheImages(links);
    }
  });

  // Add the post ids to the feed
  useFeedStore.setState((state) => {
    const feed = state.feeds.get(screenId);

    if (feed == null || refresh) {
      state.feeds.set(screenId, {
        feedId: screenId,
        postIds,
        nextPage: page + 1,
      });
    } else {
      feed.postIds = [...feed.postIds, ...postIds];
      feed.nextPage = page + 1;
    }
  });
};

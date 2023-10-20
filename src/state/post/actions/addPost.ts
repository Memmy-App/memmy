import { PostView } from 'lemmy-js-client';
import { useFeedStore, usePostStore, useSiteStore } from '@src/state';
import { getLinkType } from '@helpers/links/getLinkType';
import { truncateText } from '@helpers/text';
import { cacheImages } from '@helpers/image';

export const addPost = (post: PostView, screenId?: string): void => {
  usePostStore.setState((state) => {
    const currentPost = state.posts.get(post.post.id);
    const moderated = useSiteStore.getState().moderatedIds;
    const userId =
      useSiteStore.getState().site?.my_user?.local_user_view.local_user.id;

    if (currentPost != null && screenId != null) {
      currentPost.usedBy.push(screenId);
    } else {
      state.posts.set(post.post.id, {
        view: post,
        usedBy: screenId != null ? [screenId] : [],
        linkType: getLinkType(post.post.url),
        bodyPreview: truncateText(post.post.body, 200),
        moderates: moderated?.includes(post.post.community_id) ?? false,
        isOwnPost: userId === post.post.creator_id,
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
  const moderated = useSiteStore.getState().moderatedIds;
  const userId =
    useSiteStore.getState().site?.my_user?.local_user_view.local_user.id;

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
          moderates: moderated?.includes(post.post.community_id) ?? false,
          isOwnPost: userId === post.post.creator_id,
        });
      }

      if (!refresh) {
        const index = currentPosts?.indexOf(post.post.id);

        if (index == null || index === -1) {
          postIds.push(post.post.id);

          if (post.post.url != null) {
            links.push(post.post.url);
          }
        }
      } else {
        postIds.push(post.post.id);
      }

      void cacheImages(links);
    }

    // Add the post ids to the feed
    useFeedStore.setState((state) => {
      const feed = state.feeds.get(screenId);

      if (feed == null || refresh) {
        state.feeds.set(screenId, {
          feedId: screenId,
          postIds: [...postIds],
          nextPage: page + 1,
        });
      } else {
        feed.postIds = [...feed.postIds, ...postIds];
        feed.nextPage = page + 1;
      }
    });
  });
};

import { PostView } from 'lemmy-js-client';
import { usePostStore } from '@src/state';

export const updatePost = (post: PostView): void => {
  usePostStore.setState((state) => {
    const current = state.posts.get(post.post.id);

    if (current == null) return;

    current.view.post = {
      ...current.view.post,
      name: post.post.name,
      body: post.post.body,
      removed: post.post.removed,
      nsfw: post.post.nsfw,
      url: post.post.url,
      deleted: post.post.deleted,
    };
  });
};

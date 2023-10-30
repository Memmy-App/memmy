import { PostView } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

interface UpdatePostParams {
  post: PostView;
}

export const updatePost = ({ post }: UpdatePostParams): void => {
  useDataStore.setState((state) => {
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

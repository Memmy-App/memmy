import { usePostStore } from '@src/state';
import instance from '@src/Instance';

export const markPostRead = (postId: number): void => {
  usePostStore.setState((state) => {
    const post = state.posts.get(postId);

    // If the post is null or already read return
    if (post == null || post.view.read) return;

    post.view.read = true;
    void instance.markPostRead(postId);
  });
};

import instance from '@src/Instance';
import { useDataStore } from '@src/state';

interface MarkPostReadParams {
  postId: number;
}

export const markPostRead = ({ postId }: MarkPostReadParams): void => {
  useDataStore.setState((state) => {
    const post = state.posts.get(postId);

    // If the post is null or already read return
    if (post == null || post.view.read) return;

    post.view.read = true;
    void instance.markPostRead(postId);
  });
};

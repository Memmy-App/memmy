import { ICommentInfo } from '@src/types';
import { useDataStore } from '@src/state';

interface AddCommentsToPostParams {
  postId: number;
  commentInfo: ICommentInfo[];
}

export const addCommentsToPost = ({
  postId,
  commentInfo,
}: AddCommentsToPostParams): void => {
  useDataStore.setState((state) => {
    const post = state.posts.get(postId);

    if (post == null) return;

    post.commentInfo = commentInfo;
  });
};

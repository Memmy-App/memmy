import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { useDataStore } from '@src/state';
import { shareLink } from '@helpers/share/shareLink';

export const shareOption = ({
  commentId,
  postId,
}: SwipeableActionParams): void => {
  const store = useDataStore.getState();

  const link =
    commentId != null
      ? store.comments.get(commentId)?.view.comment.ap_id
      : store.posts.get(postId ?? 0)?.view.post.ap_id;

  if (link == null) return;

  void shareLink({
    link,
  });
};

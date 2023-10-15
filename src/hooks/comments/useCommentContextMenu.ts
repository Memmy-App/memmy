import { useCallback } from 'react';
import instance from '@src/Instance';

interface UseCommentContextMenu {
  upvote: () => void;
  downvote: () => void;
}

export const useCommentContextMenu = (
  itemId: number,
): UseCommentContextMenu => {
  const upvote = useCallback(() => {
    void instance.likeComment(itemId, 1);
  }, [itemId]);

  const downvote = useCallback(() => {
    void instance.likeComment(itemId, -1);
  }, [itemId]);

  return {
    upvote,
    downvote,
  };
};

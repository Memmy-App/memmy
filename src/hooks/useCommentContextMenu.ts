import { useComment } from '@src/state/comment/commentStore';
import { useCallback } from 'react';
import { Alert } from 'react-native';

interface UseCommentContextMenu {
  actionOne: () => void;
}

export const useCommentContextMenu = (
  itemId: number,
): UseCommentContextMenu => {
  const comment = useComment(itemId);

  const actionOne = useCallback(() => {
    Alert.alert(comment?.comment.ap_id ?? 'nope');
  }, [itemId]);

  return {
    actionOne,
  };
};

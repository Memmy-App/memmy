import React, { useCallback } from 'react';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Bookmark } from '@tamagui/lucide-icons';
import { usePostSaved } from '@src/state';
import instance from '@src/Instance';

interface IProps {
  itemId: number;
}

function PostSaveButton({ itemId }: IProps): React.JSX.Element {
  const postSaved = usePostSaved(itemId);

  const doSavePost = useCallback(() => {
    void instance.savePost({ postId: itemId });
  }, [itemId, postSaved]);

  return (
    <AnimatedIconButton
      icon={Bookmark}
      color={postSaved ? 'white' : '$accent'}
      iconSize={25}
      onPress={doSavePost}
      backgroundColor={postSaved ? '$bookmark' : undefined}
    />
  );
}

export default React.memo(PostSaveButton);

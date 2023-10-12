import React, { useCallback } from 'react';
import { usePostActorId, usePostLink } from '@src/state/post/postStore';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Share } from '@tamagui/lucide-icons';
import { openLink } from '@helpers/links';

interface IProps {
  itemId: number;
  type: 'post' | 'link';
}

function PostShareButton({ itemId, type }: IProps): React.JSX.Element {
  const postLink = usePostLink(itemId);
  const postActorId = usePostActorId(itemId);

  const onPress = useCallback(() => {
    if (type === 'post' || postLink == null) {
      openLink(postActorId);
      return;
    }

    openLink(postLink);
  }, [itemId, type]);

  return (
    <>
      <AnimatedIconButton
        icon={Share}
        color="$accent"
        iconSize={25}
        onPress={onPress}
      />
    </>
  );
}

export default React.memo(PostShareButton);

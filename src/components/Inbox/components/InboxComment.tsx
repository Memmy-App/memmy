import React, { useCallback, useState } from 'react';
import { useCommentSwipeOptions } from '@components/Common/SwipeableRow/hooks/useCommentSwipeOptions';
import { PressableComment } from '@components/Comment/components/Comment';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addPost, useCommentPostId } from '@src/state';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import instance from '@src/Instance';

interface IProps {
  itemId: number;
}

function InboxComment({ itemId }: IProps): React.JSX.Element {
  const leftOptions = useCommentSwipeOptions('left');
  const rightOptions = useCommentSwipeOptions('right');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postId = useCommentPostId(itemId);

  const [loadingPost, setLoadingPost] = useState(false);

  const onCommentPress = useCallback(async () => {
    setLoadingPost(true);

    const res = await instance.getPost(postId ?? 0);

    setLoadingPost(false);

    addPost(res.post_view);

    navigation.push('Post', {
      postId,
      scrollToCommentId: itemId,
    });
  }, [itemId]);

  return (
    <>
      <LoadingOverlay visible={loadingPost} />
      <PressableComment
        itemId={itemId}
        depth={0}
        collapsed={false}
        leftOptions={leftOptions}
        rightOptions={rightOptions}
        onPress={onCommentPress}
        space
      />
    </>
  );
}

export default React.memo(InboxComment);

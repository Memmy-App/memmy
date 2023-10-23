import React, { useCallback } from 'react';
import { PressableComment } from '@components/Comment/components/Comment';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import instance from '@src/Instance';
import { addPost, useCommentPath, useCommentPostId } from '@src/state';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';

interface IProps {
  itemId: number;
}

function ProfileComment({ itemId }: IProps): React.JSX.Element {
  const profileScreen = useProfileScreenContext();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const commentPath = useCommentPath(itemId);
  const commentPostId = useCommentPostId(itemId);

  const onPress = useCallback(async () => {
    // Display loading
    profileScreen.setPostLoading?.(true);

    // Try to get the post and add it to the store
    try {
      const res = await instance.getPost(commentPostId ?? 0);
      profileScreen.setPostLoading?.(false);
      addPost(res.post_view);

      // Send to the post
      navigation.push('Post', {
        postId: commentPostId,
        parentCommentId: itemId,
      });
    } catch (e) {
      profileScreen.setPostLoading?.(false);
    }
  }, [itemId]);

  // TODO Properly handle this likely with a context
  return <PressableComment itemId={itemId} space onPress={onPress} />;
}

export default React.memo(ProfileComment);

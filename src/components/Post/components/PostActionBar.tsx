import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';
import PostSaveButton from '@components/Common/PostCard/PostSaveButton';
import { useRoute } from '@react-navigation/core';
import { View } from 'tamagui';
import PostShareButton from '@components/Common/PostCard/PostShareButton';

function PostActionBar(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      borderTopWidth={1}
      borderColor="$bg"
      paddingVertical="$2"
    >
      <View flexGrow={1} alignItems="center">
        <PostUpvoteButton itemId={postId} />
      </View>
      <View flexGrow={1} alignItems="center">
        <PostDownvoteButton itemId={postId} />
      </View>
      <View flexGrow={1} alignItems="center">
        <PostSaveButton itemId={postId} />
      </View>
      <View flexGrow={1} alignItems="center">
        <PostShareButton itemId={postId} type="post" />
      </View>
    </HStack>
  );
}

export default PostActionBar;

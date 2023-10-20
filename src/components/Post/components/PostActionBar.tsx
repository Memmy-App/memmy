import React from 'react';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';
import PostSaveButton from '@components/Common/PostCard/PostSaveButton';
import { useRoute } from '@react-navigation/core';
import PostShareButton from '@components/Common/PostCard/PostShareButton';
import PostReplyButton from '@components/Common/PostCard/PostReplyButton';
import { XStack } from 'tamagui';

function PostActionBar(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="$bg"
      py="$2"
      px="$5"
    >
      <PostUpvoteButton itemId={postId} />
      <PostDownvoteButton itemId={postId} />
      <PostSaveButton itemId={postId} />
      <PostShareButton itemId={postId} type="post" />
      <PostReplyButton itemId={postId} />
    </XStack>
  );
}

export default PostActionBar;

import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';
import PostSaveButton from '@components/Common/PostCard/PostSaveButton';
import { useRoute } from '@react-navigation/core';
import PostShareButton from '@components/Common/PostCard/PostShareButton';
import PostReplyButton from '@components/Common/PostCard/PostReplyButton';

function PostActionBar(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="$bg"
      paddingVertical="$2"
      paddingHorizontal="$5"
    >
      <PostUpvoteButton itemId={postId} />
      <PostDownvoteButton itemId={postId} />
      <PostSaveButton itemId={postId} />
      <PostShareButton itemId={postId} type="post" />
      <PostReplyButton itemId={postId} />
    </HStack>
  );
}

export default PostActionBar;

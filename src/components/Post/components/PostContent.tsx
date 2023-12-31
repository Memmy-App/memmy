import React from 'react';
import {
  usePostBody,
  usePostDeleted,
  usePostLink,
  usePostLinkType,
  usePostRemoved,
} from '@src/state';
import { useRoute } from '@react-navigation/core';
import { Text, View } from 'tamagui';
import Markdown from '@components/Common/Markdown/Markdown';
import PostLinkPreview from '@components/Common/PostCard/PostLinkPreview';
import ViewerImageWrapper from '@components/Common/ImageViewer/ViewerImageWrapper';

function PostContent(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const postLinkType = usePostLinkType(postId);
  const postBody = usePostBody(postId);
  const postLink = usePostLink(postId);
  const postRemoved = usePostRemoved(postId);
  const postDeleted = usePostDeleted(postId);

  if (postDeleted) {
    return (
      <View m="$3">
        <Text color="$secondary" fontSize="$3" fontStyle="italic">
          Post was deleted by the user
        </Text>
      </View>
    );
  }

  if (postRemoved) {
    return (
      <View m="$3">
        <Text color="$secondary" fontSize="$3" fontStyle="italic">
          Post was removed by a moderator
        </Text>
      </View>
    );
  }

  return (
    <View>
      {postLinkType === 'image' && (
        <View
          my="$3"
          justifyContent="center"
          alignItems="center"
          backgroundColor="$bg"
        >
          <ViewerImageWrapper itemId={postId} type="full" />
        </View>
      )}
      {postBody != null && (
        <View m="$3">
          <Markdown>{postBody}</Markdown>
        </View>
      )}
      {postLink != null && postLinkType !== 'image' && (
        <PostLinkPreview itemId={postId} />
      )}
    </View>
  );
}

export default React.memo(PostContent);

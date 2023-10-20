import React from 'react';
import {
  usePostBody,
  usePostCommunityNsfw,
  usePostDeleted,
  usePostLink,
  usePostLinkType,
  usePostNsfw,
  usePostRemoved,
} from '@src/state';
import { useRoute } from '@react-navigation/core';
import { Text, View } from 'tamagui';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';
import Markdown from '@components/Common/Markdown/Markdown';
import PostLinkPreview from '@components/Common/PostCard/PostLinkPreview';

function PostContent(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const postLinkType = usePostLinkType(postId);
  const postBody = usePostBody(postId);
  const postLink = usePostLink(postId);
  const postNsfw = usePostNsfw(postId);
  const postCommunityNsfw = usePostCommunityNsfw(postId);
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
        <View marginVertical="$3">
          <ViewerImage
            source={postLink!}
            blurRadius={postNsfw || postCommunityNsfw ? 90 : 0}
          />
        </View>
      )}
      {postBody != null && (
        <View margin="$3">
          <Markdown>{postBody}</Markdown>
        </View>
      )}
      {postLink != null && <PostLinkPreview itemId={postId} />}
    </View>
  );
}

export default React.memo(PostContent);

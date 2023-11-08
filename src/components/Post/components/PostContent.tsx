import React from 'react';
import {
  useBlurNsfw,
  usePostBody,
  usePostCommunityNsfw,
  usePostDeleted,
  usePostLink,
  usePostLinkType,
  usePostNsfw,
  usePostRemoved,
  usePostTitle,
} from '@src/state';
import { useRoute } from '@react-navigation/core';
import { Text, useTheme, View } from 'tamagui';
import Markdown from '@components/Common/Markdown/Markdown';
import PostLinkPreview from '@components/Common/PostCard/PostLinkPreview';
import { ViewerImage } from 'expo-image-viewer';

function PostContent(): React.JSX.Element {
  const theme = useTheme();

  const { postId } = useRoute<any>().params;

  const blurNsfw = useBlurNsfw();

  const postNsfw = usePostNsfw(postId);
  const postCommunityNsfw = usePostCommunityNsfw(postId);
  const postLinkType = usePostLinkType(postId);
  const postBody = usePostBody(postId);
  const postLink = usePostLink(postId);
  const postRemoved = usePostRemoved(postId);
  const postDeleted = usePostDeleted(postId);
  const postTitle = usePostTitle(postId);

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
          <ViewerImage
            source={postLink!}
            blurRadius={(postNsfw || postCommunityNsfw) && blurNsfw ? 90 : 0}
            title={postTitle}
            initialDimensions={{ width: 300, height: 300 }}
            showActivityIndicator
            activityIndicatorColor={theme.accent.val}
          />
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

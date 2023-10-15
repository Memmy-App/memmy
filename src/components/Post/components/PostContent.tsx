import React from 'react';
import {
  usePostBody,
  usePostCommunityNsfw,
  usePostLink,
  usePostLinkType,
  usePostNsfw,
} from '@src/state/post/postStore';
import { useRoute } from '@react-navigation/core';
import { View } from 'tamagui';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';
import Markdown from '@components/Common/Markdown/Markdown';

function PostContent(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const postLinkType = usePostLinkType(postId);
  const postBody = usePostBody(postId);
  const postLink = usePostLink(postId);
  const postNsfw = usePostNsfw(postId);
  const postCommunityNsfw = usePostCommunityNsfw(postId);

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
        <View marginHorizontal="$3" marginVertical="$3">
          <Markdown>{postBody}</Markdown>
        </View>
      )}
    </View>
  );
}

export default React.memo(PostContent);

import React from 'react';
import {
  usePostBodyPreview,
  usePostCommunityNsfw,
  usePostLink,
  usePostLinkType,
  usePostNsfw,
  usePostTitle,
} from '@src/state';
import { View } from 'tamagui';
import Markdown from '@components/Common/Markdown/Markdown';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';
import PostLinkPreview from '@components/Common/PostCard/PostLinkPreview';

interface IProps {
  itemId: number;
}

function FeedItemContent({ itemId }: IProps): React.JSX.Element | null {
  const postLink = usePostLink(itemId);
  const postBodyPreview = usePostBodyPreview(itemId);
  const postLinkType = usePostLinkType(itemId);
  const postNsfw = usePostNsfw(itemId);
  const postCommunityNsfw = usePostCommunityNsfw(itemId);
  const postTitle = usePostTitle(itemId);

  if (postLinkType === 'image') {
    return (
      <View marginVertical="$3" justifyContent="center" backgroundColor="$bg">
        <ViewerImage
          source={postLink!}
          blurRadius={postNsfw || postCommunityNsfw ? 90 : 0}
          title={postTitle}
        />
      </View>
    );
  }

  return (
    <View>
      {postBodyPreview != null && (
        <View marginHorizontal="$3">
          <Markdown color="$secondary">{postBodyPreview}</Markdown>
        </View>
      )}
      {postLink != null && <PostLinkPreview itemId={itemId} />}
    </View>
  );
}

export default React.memo(FeedItemContent);

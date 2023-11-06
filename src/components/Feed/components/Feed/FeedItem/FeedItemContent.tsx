import React from 'react';
import { usePostBodyPreview, usePostLink, usePostLinkType } from '@src/state';
import { View } from 'tamagui';
import Markdown from '@components/Common/Markdown/Markdown';
import PostLinkPreview from '@components/Common/PostCard/PostLinkPreview';
import ViewerImageWrapper from '@components/Common/ImageViewer/ViewerImageWrapper';

interface IProps {
  itemId: number;
}

function FeedItemContent({ itemId }: IProps): React.JSX.Element | null {
  const postLink = usePostLink(itemId);
  const postBodyPreview = usePostBodyPreview(itemId);
  const postLinkType = usePostLinkType(itemId);

  if (postLinkType === 'image') {
    return (
      <View
        my="$3"
        justifyContent="center"
        alignItems="center"
        backgroundColor="$bg"
      >
        <ViewerImageWrapper itemId={itemId} type="full" />
      </View>
    );
  }

  return (
    <View>
      {postBodyPreview != null && (
        <View mx="$3">
          <Markdown color="$color">{postBodyPreview}</Markdown>
        </View>
      )}
      {postLink != null && <PostLinkPreview itemId={itemId} />}
    </View>
  );
}

export default React.memo(FeedItemContent);

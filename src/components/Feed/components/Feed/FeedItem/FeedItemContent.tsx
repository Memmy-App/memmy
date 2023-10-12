import React from 'react';
import {
  usePostBodyPreview,
  usePostLink,
  usePostLinkType,
} from '@src/state/post/postStore';
import { View } from 'tamagui';
import Markdown from '@components/Common/Markdown/Markdown';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';

interface IProps {
  itemId: number;
}

function FeedItemContent({ itemId }: IProps): React.JSX.Element | null {
  const postLink = usePostLink(itemId);
  const postBodyPreview = usePostBodyPreview(itemId);
  const postLinkType = usePostLinkType(itemId);

  if (postLinkType === 'image') {
    return (
      <View marginVertical="$3" justifyContent="center">
        <ViewerImage source={postLink!} />
      </View>
    );
  }

  if (postLinkType === 'generic' && postBodyPreview != null) {
    return (
      <View marginHorizontal="$3" marginVertical="$3">
        <Markdown color="$secondary">{postBodyPreview}</Markdown>
      </View>
    );
  }

  return null;
}

export default React.memo(FeedItemContent);

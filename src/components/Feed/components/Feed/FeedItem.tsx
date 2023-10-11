import React from 'react';
import {
  usePost,
  usePostCommunityName,
  usePostTitle,
} from '@src/state/post/postStore';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';
import FeedItemFooter from '@components/Feed/components/Feed/FeedItem/FeedItemFooter';
import FeedItemPostInfo from '@components/Feed/components/Feed/FeedItem/FeedItemPostInfo';
import FeedItemActionButtons from '@components/Feed/components/Feed/FeedItem/FeedItemActionButtons';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);
  const postCommunityName = usePostCommunityName(itemId);

  const post = usePost(itemId);

  const isImagePost = post?.url?.includes('.png') ?? false;

  return (
    <FeedItemContainer>
      <FeedItemHeader title={postTitle} communityName={postCommunityName} />
      {isImagePost && <ViewerImage source={post?.url ?? ''} />}
      <FeedItemFooter>
        <FeedItemPostInfo itemId={itemId} />
        <FeedItemActionButtons itemId={itemId} />
      </FeedItemFooter>
    </FeedItemContainer>
  );
}

export default React.memo(FeedItem);

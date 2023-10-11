import React from 'react';
import { usePostCommunityName, usePostTitle } from '@src/state/post/postStore';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';
import FeedItemFooter from '@components/Feed/components/Feed/FeedItem/FeedItemFooter';
import FeedItemPostInfo from '@components/Feed/components/Feed/FeedItem/FeedItemPostInfo';
import FeedItemActionButtons from '@components/Feed/components/Feed/FeedItem/FeedItemActionButtons';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);
  const postCommunityName = usePostCommunityName(itemId);

  return (
    <FeedItemContainer>
      <FeedItemHeader title={postTitle} communityName={postCommunityName} />
      <FeedItemFooter>
        <FeedItemPostInfo itemId={itemId} />
        <FeedItemActionButtons itemId={itemId} />
      </FeedItemFooter>
    </FeedItemContainer>
  );
}

export default React.memo(FeedItem);

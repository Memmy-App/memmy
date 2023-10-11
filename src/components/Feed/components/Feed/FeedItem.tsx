import React from 'react';
import {
  usePost,
  usePostCommunityName,
  usePostTitle,
} from '@src/state/post/postStore';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const post = usePost(itemId);
  const postTitle = usePostTitle(itemId);
  const postCommunityName = usePostCommunityName(itemId);

  return (
    <FeedItemContainer>
      <FeedItemHeader title={postTitle} communityName={postCommunityName} />
    </FeedItemContainer>
  );
}

export default React.memo(FeedItem);

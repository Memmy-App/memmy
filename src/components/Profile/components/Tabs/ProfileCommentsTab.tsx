import React from 'react';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { useProfileComments } from '@src/state';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommentView } from 'lemmy-js-client';
import Comment from '@components/Comment/components/Comment';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useTheme } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';

const renderItem = ({
  item,
}: ListRenderItemInfo<CommentView>): React.JSX.Element => {
  return <Comment itemId={item.comment.id} space />;
};

const keyExtractor = (item: CommentView): string => item.comment.id.toString();

interface IProps {
  selected: number;
}

function ProfileCommentsTab({ selected }: IProps): React.JSX.Element | null {
  const profileScreenContext = useProfileScreenContext();
  // TODO no need to store profile comments in global state, we can just return them in the hook
  const profileComments = useProfileComments(profileScreenContext.profileId);

  const theme = useTheme();

  if (selected !== 1) {
    return null;
  }

  return (
    <FlashList<CommentView>
      renderItem={renderItem}
      data={profileComments}
      keyExtractor={keyExtractor}
      estimatedItemSize={100}
      onScroll={profileScreenContext.onScroll}
      scrollEventThrottle={16}
      ListEmptyComponent={
        <FeedLoadingIndicator
          loading={profileScreenContext.isLoading}
          error={profileScreenContext.isError}
          empty={profileComments != null && profileComments.length < 1}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={profileScreenContext.isRefreshing}
          onRefresh={profileScreenContext.refresh}
        />
      }
      contentContainerStyle={{ backgroundColor: theme.bg.val }}
    />
  );
}

export default React.memo(ProfileCommentsTab);

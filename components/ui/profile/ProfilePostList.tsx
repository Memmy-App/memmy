import React from "react";
import PagerView from "react-native-pager-view";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { UseProfile } from "../../hooks/profile/useProfile";
import UserProfileHeader from "../../screens/userProfile/UserProfileHeader";
import NoResultView from "../common/NoResultView";
import CompactFeedItem from "../Feed/CompactFeedItem/CompactFeedItem";
import { ProfileRefreshControl } from "./ProfileRefreshControl";

interface IProps {
  profile: UseProfile;
  pagerView: React.MutableRefObject<PagerView>;
}

function ProfilePostList({ profile, pagerView }: IProps) {
  const keyExtractor = (item: PostView) => item.post.id.toString();

  const renderItem = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

  return (
    <FlashList
      renderItem={renderItem}
      ListHeaderComponent={
        <UserProfileHeader profile={profile} pagerView={pagerView} />
      }
      estimatedItemSize={150}
      data={profile.posts}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<NoResultView type="posts" />}
      refreshing={profile.loading}
      refreshControl={<ProfileRefreshControl profile={profile} />}
    />
  );
}

export default ProfilePostList;

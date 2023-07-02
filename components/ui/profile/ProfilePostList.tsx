import React, { ReactElement } from "react";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { UseProfile } from "../../hooks/profile/useProfile";
import NoResultView from "../common/NoResultView";
import CompactFeedItem from "../Feed/CompactFeedItem/CompactFeedItem";
import { ProfileRefreshControl } from "./ProfileRefreshControl";

interface IProps {
  profile: UseProfile;
  header: ReactElement;
}

function ProfilePostList({ profile, header }: IProps) {
  const keyExtractor = (item: PostView) => item.post.id.toString();

  const renderItem = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

  return (
    <FlashList
      renderItem={renderItem}
      ListHeaderComponent={header}
      estimatedItemSize={150}
      data={profile.posts}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<NoResultView type="profilePosts" />}
      refreshing={profile.loading}
      refreshControl={<ProfileRefreshControl profile={profile} />}
    />
  );
}

export default ProfilePostList;

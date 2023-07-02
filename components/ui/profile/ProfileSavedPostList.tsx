import React, { ReactElement } from "react";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { UseProfile } from "../../hooks/profile/useProfile";
import NoResultView from "../common/NoResultView";
import { ProfileRefreshControl } from "./ProfileRefreshControl";
import CompactFeedItem from "../Feed/CompactFeedItem/CompactFeedItem";

interface IProps {
  profile: UseProfile;
  header: ReactElement;
}

function ProfileSavedPostList({ profile, header }: IProps) {
  const keyExtractor = (item: PostView) => item.post.id.toString();

  const renderItem = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

  return (
    <FlashList
      renderItem={renderItem}
      ListHeaderComponent={header}
      estimatedItemSize={150}
      data={profile.savedPosts}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<NoResultView type="profilePosts" />}
      refreshing={profile.loading}
      refreshControl={<ProfileRefreshControl profile={profile} />}
    />
  );
}

export default ProfileSavedPostList;

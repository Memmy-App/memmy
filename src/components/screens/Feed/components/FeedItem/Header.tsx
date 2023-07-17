import { Community, PostView } from "lemmy-js-client";
import { HStack } from "native-base";
import React from "react";
import { UseFeedItem } from "../../../../../hooks/feeds/useFeedItem";
import CommunityLink from "../../../../common/CommunityLink";
import { FeedItemContextMenu } from "../../../../common/ContextMenu/FeedItemContextMenu";
import FeaturedIndicator from "../../../../common/FeaturedIndicator";
import { IsReadIndicator } from "../../../../common/IsReadIndicator";
import SFIcon from "../../../../common/icons/SFIcon";

interface Props {
  community: Community;
  featured: boolean;
  isRead: boolean;
  feedItem: UseFeedItem;
  post: PostView;
}

export function Header({ community, featured, isRead, feedItem, post }: Props) {
  return (
    <HStack
      mx={4}
      mt={2}
      mb={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <CommunityLink community={community} />
      <HStack space={1} alignItems="center">
        <FeaturedIndicator featured={featured} />
        <IsReadIndicator isRead={isRead} />
        <FeedItemContextMenu
          onPress={() => {}}
          feedItem={feedItem}
          post={post}
          isButton
        >
          <SFIcon icon="ellipsis" size={14} />
        </FeedItemContextMenu>
      </HStack>
    </HStack>
  );
}

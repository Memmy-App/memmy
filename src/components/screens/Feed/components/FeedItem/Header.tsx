import { Community } from "lemmy-js-client";
import { HStack } from "@src/components/common/Gluestack";
import React from "react";
import IconButtonWithText from "@root/src/components/common/IconButtonWithText";
import { UseFeedItem } from "../../../../../hooks/feeds/useFeedItem";
import CommunityLink from "../../../../common/CommunityLink";
import { FeedItemContextMenu } from "../../../../common/ContextMenu/FeedItemContextMenu";
import FeaturedIndicator from "../../../../common/FeaturedIndicator";
import { IsReadIndicator } from "../../../../common/IsReadIndicator";
import SFIcon from "../../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../../constants/IconMap";

interface Props {
  community: Community;
  featured: boolean;
  isRead: boolean;
  feedItem: UseFeedItem;
}

export function Header({ community, featured, isRead, feedItem }: Props) {
  return (
    <HStack mx="$4" mt="$2" justifyContent="space-between" alignItems="center">
      <CommunityLink community={community} />
      <HStack space="sm" alignItems="center">
        <FeaturedIndicator featured={featured} />
        <IsReadIndicator isRead={isRead} />
        <FeedItemContextMenu feedItem={feedItem} isButton>
          <IconButtonWithText
            icon={<SFIcon icon={ICON_MAP.MORE_OPTIONS} size={14} />}
          />
        </FeedItemContextMenu>
      </HStack>
    </HStack>
  );
}

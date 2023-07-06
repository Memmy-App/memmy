import React from "react";
import { HStack } from "native-base";
import { Community } from "lemmy-js-client";
import CommunityLink from "../../CommunityLink";
import FeaturedIndicator from "../../common/FeaturedIndicator";
import { IsReadIndicator } from "../../common/IsReadIndicator";

interface Props {
  community: Community;
  featured: boolean;
  isRead: boolean;
}

export function Header({ community, featured, isRead }: Props) {
  return (
    <HStack
      mx={4}
      mt={2}
      mb={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <CommunityLink community={community} />
      <HStack space={1}>
        <FeaturedIndicator featured={featured} />
        <IsReadIndicator isRead={isRead} />
      </HStack>
    </HStack>
  );
}

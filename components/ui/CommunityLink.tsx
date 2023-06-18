import React from "react";
import { CommunityView } from "lemmy-js-client";
import { Text } from "native-base";
import Link from "./Link";

interface CommunityLinkProps {
  community: CommunityView;
  isFeedItem?: boolean;
}

function CommunityLink({ community, isFeedItem }: CommunityLinkProps) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      screen="Community"
      params={{
        communityId: community.id,
        actorId: community.actor_id,
        communityName: community.name,
      }}
    >
      <Text color={isFeedItem && "gray.400"} fontWeight="bold">
        {community.name}
      </Text>
    </Link>
  );
}

export default CommunityLink;

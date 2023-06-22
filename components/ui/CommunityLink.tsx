import React from "react";
import { CommunitySafe } from "lemmy-js-client";
import { Text } from "native-base";
import Link from "./Link";
import { getBaseUrl } from "../../helpers/LinkHelper";

interface CommunityLinkProps {
  community: CommunitySafe;
  color?: string;
}

function CommunityLink({ community, color }: CommunityLinkProps) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      screen="Community"
      params={{
        communityId: community.id,
        actorId: community.actor_id,
        communityName: community.name,
        communityFullName: `${community.name}@${getBaseUrl(
          community.actor_id
        )}`,
      }}
    >
      <Text color={color}>{community.name}</Text>
    </Link>
  );
}

export default CommunityLink;

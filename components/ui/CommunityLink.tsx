import React from "react";
import { CommunitySafe } from "lemmy-js-client";
import { HStack, Text } from "native-base";
import Link from "./Link";
import { getBaseUrl } from "../../helpers/LinkHelper";

interface CommunityLinkProps {
  community: CommunitySafe;
  instanceBaseUrl?: string;
  color?: string;
}

function CommunityLink({
  community,
  instanceBaseUrl,
  color,
}: CommunityLinkProps) {
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
      <HStack>
        <Text color={color} fontWeight="medium">
          {community.name}
        </Text>
        {instanceBaseUrl && (
          <Text color={color} fontWeight="medium">
            @{instanceBaseUrl}
          </Text>
        )}
      </HStack>
    </Link>
  );
}

export default CommunityLink;

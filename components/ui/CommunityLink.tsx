import React from "react";
import { CommunitySafe } from "lemmy-js-client";
import { Text, useTheme } from "native-base";
import Link from "./Link";
import { getBaseUrl } from "../../helpers/LinkHelper";

interface CommunityLinkProps {
  community: CommunitySafe;
  isFeedItem?: boolean;
}

function CommunityLink({ community, isFeedItem }: CommunityLinkProps) {
  const theme = useTheme();
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
      <Text color={isFeedItem && theme.colors.secondaryText}>
        {community.name}
      </Text>
    </Link>
  );
}

export default CommunityLink;

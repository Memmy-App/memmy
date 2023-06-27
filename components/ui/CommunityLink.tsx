import React from "react";
import { CommunitySafe } from "lemmy-js-client";
import { HStack, Text } from "native-base";
import { IconPlanet } from "tabler-icons-react-native";
import Link from "./buttons/Link";
import { getBaseUrl } from "../../helpers/LinkHelper";

interface CommunityLinkProps {
  community: CommunitySafe;
  instanceBaseUrl?: string;
  color?: string;
  hideIcon?: boolean;
}

function CommunityLink({
  community,
  instanceBaseUrl,
  color,
  hideIcon,
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
      <HStack alignItems="center" space={1}>
        {hideIcon ? null : <IconPlanet color={color} size={16} />}
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

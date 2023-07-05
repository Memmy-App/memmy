import { Community } from "lemmy-js-client";
import { HStack, Text, useTheme } from "native-base";
import React from "react";
import { IconPlanet } from "tabler-icons-react-native";
import { getBaseUrl } from "../../helpers/LinkHelper";
import Link from "./buttons/Link";

interface CommunityLinkProps {
  community: Community;
  instanceBaseUrl?: string;
}

function CommunityLink({ community, instanceBaseUrl }: CommunityLinkProps) {
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
      <HStack>
        <HStack alignItems="center" space={1}>
          <IconPlanet color={theme.colors.app.textSecondary} size={16} />
          <Text color={theme.colors.app.textSecondary} fontWeight="medium">
            {community.name}
          </Text>
        </HStack>
        {instanceBaseUrl && (
          <Text color={theme.colors.app.textSecondary} fontWeight="medium">
            @{instanceBaseUrl}
          </Text>
        )}
      </HStack>
    </Link>
  );
}

export default React.memo(CommunityLink);

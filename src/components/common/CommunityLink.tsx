import FastImage from "@gkasdorf/react-native-fast-image";
import { Community } from "lemmy-js-client";
import { HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { getBaseUrl } from "../../helpers/LinkHelper";
import Link from "./Buttons/Link";
import { PlanetIcon } from "./icons/PlanetIcon";

interface CommunityLinkProps {
  community: Community;
  instanceBaseUrl?: string;
}

function CommunityLink({ community, instanceBaseUrl }: CommunityLinkProps) {
  const theme = useThemeOptions();

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
        <HStack alignItems="center" space="xs">
          {community.icon ? (
            <FastImage
              source={{
                uri: community.icon,
              }}
              style={{ height: 18, width: 18, borderRadius: 100 }}
            />
          ) : (
            <PlanetIcon color={theme.colors.textSecondary} size={16} />
          )}
          <Text
            color={theme.colors.textSecondary}
            fontWeight="medium"
            size="sm"
          >
            {community.name}
          </Text>
        </HStack>
        {instanceBaseUrl && (
          <Text
            color={theme.colors.textSecondary}
            fontWeight="medium"
            size="xs"
          >
            @{instanceBaseUrl}
          </Text>
        )}
      </HStack>
    </Link>
  );
}

export default React.memo(CommunityLink);

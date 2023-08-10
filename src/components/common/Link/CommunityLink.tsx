import React, { useMemo } from "react";
import { Community } from "lemmy-js-client";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { getBaseUrl } from "@src/helpers/links";
import { Link } from "@react-navigation/native";
import { HStack, Text } from "@src/components/gluestack";
import FastImage from "@gkasdorf/react-native-fast-image";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/types/constants/IconMap";

interface IProps {
  community: Community;
}

function CommunityLink({ community }: IProps) {
  const theme = useThemeOptions();
  const baseUrl = useMemo(() => getBaseUrl(community.actor_id), [community]);
  const fullName = `${community.name}@${baseUrl}`;

  return (
    <Link
      screen="Community"
      params={{
        communityId: community.id,
        actorId: community.actor_id,
        communityName: community.name,
        communityFullName: fullName,
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
            <SFIcon icon={ICON_MAP.GLOBE} size={16} />
          )}
          <Text
            color={theme.colors.textSecondary}
            fontWeight="medium"
            size="sm"
          >
            {community.name}
          </Text>
        </HStack>
        {baseUrl && (
          <Text
            color={theme.colors.textSecondary}
            fontWeight="medium"
            size="sm"
          >
            @{baseUrl}
          </Text>
        )}
      </HStack>
    </Link>
  );
}

export default React.memo(CommunityLink);

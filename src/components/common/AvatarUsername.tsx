import FastImage from "@gkasdorf/react-native-fast-image";
import { Badge, HStack, Text, VStack } from "@src/components/common/Gluestack";
import { ICON_MAP } from "@src/constants/IconMap";
import { getUserFullName } from "@src/helpers/LemmyHelpers";
import { getBaseUrl } from "@src/helpers/LinkHelper";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import { Person } from "lemmy-js-client";
import React from "react";
import Link from "./Buttons/Link";
import SFIcon from "./icons/SFIcon";

export type NameType = "admin" | "mod" | "dev" | "op";

const devIds = ["gkd@lemmy.ml", "sgriff@lemmy.ml"];

function isUserDev(userId: string): boolean {
  return devIds.includes(userId);
}

function getUserPillType({
  user,
  opId,
  isMod,
}: {
  user: Person;
  opId?: number;
  isMod?: boolean;
}): NameType | undefined {
  if (isMod) {
    return "mod";
  }

  if (isUserDev(getUserFullName(user))) {
    return "dev";
  }

  if (user.admin) {
    return "admin";
  }

  if (user.id === opId) {
    return "op";
  }

  return undefined;
}

interface IProps {
  creator: Person;
  showAvatar?: boolean;
  opId?: number;
  isMod?: boolean;
  children?: React.ReactNode;
  link?: boolean;
  showPill?: boolean;
}

function AvatarUsername({
  showAvatar = true,
  creator,
  opId,
  isMod = false,
  children,
  link = true,
  showPill = true,
}: IProps) {
  const showInstanceForUsernames = useSettingsStore(
    (state) => state.settings.showInstanceForUsernames
  );
  const theme = useThemeOptions();
  const type = getUserPillType({ user: creator, opId, isMod });

  const NameColorMap: Record<NameType, { color: string; variant: NameType }> = {
    admin: {
      color: theme.colors.adminText,
      variant: "admin",
    },
    mod: {
      color: theme.colors.modText,
      variant: "mod",
    },
    op: {
      color: theme.colors.opText,
      variant: "op",
    },
    dev: {
      color: theme.colors.devText,
      variant: "dev",
    },
  };

  const nameProps = NameColorMap[type];

  return (
    <HStack space="xs" alignItems="center">
      {showAvatar &&
        (creator.avatar ? (
          <FastImage
            source={{
              uri: creator.avatar,
            }}
            style={{ height: 18, width: 18, borderRadius: 100 }}
          />
        ) : (
          <SFIcon
            icon={ICON_MAP.USER_AVATAR}
            color={theme.colors.textSecondary}
            size={14}
            boxSize={18}
          />
        ))}
      <VStack space="xxxs">
        <HStack space="xxs" alignItems="center">
          <Link
            screen="Profile"
            params={{
              fullUsername: getUserFullName(creator),
            }}
            cancel={!link}
          >
            <Text
              fontWeight="normal"
              size="sm"
              color={type ? nameProps.color : theme.colors.textSecondary}
            >
              {creator.name}
            </Text>
          </Link>
          {creator.bot_account && (
            <Badge size="sm" action="info">
              <Badge.Text>Bot</Badge.Text>
            </Badge>
          )}
          {type && showPill && (
            <Badge size="sm" variant="solid" user={nameProps.variant}>
              <Badge.Text>{nameProps.variant}</Badge.Text>
            </Badge>
          )}
        </HStack>
        {showInstanceForUsernames && (
          <Text size="xs" color={theme.colors.textPrimary}>
            {getBaseUrl(creator.actor_id)}
          </Text>
        )}
      </VStack>
      {children}
    </HStack>
  );
}

export default React.memo(AvatarUsername);

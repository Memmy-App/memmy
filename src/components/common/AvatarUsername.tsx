import FastImage from "@gkasdorf/react-native-fast-image";
import { Person } from "lemmy-js-client";
import { HStack, Text, useTheme, VStack } from "native-base";
import React from "react";
import { useAppSelector } from "../../../store";
import { ICON_MAP } from "../../constants/IconMap";
import { getUserFullName } from "../../helpers/LemmyHelpers";
import { getBaseUrl } from "../../helpers/LinkHelper";
import { selectSettings } from "../../slices/settings/settingsSlice";
import Link from "./Buttons/Link";
import Chip from "./Chip";
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
  const { showInstanceForUsernames } = useAppSelector(selectSettings);
  const theme = useTheme();
  const type = getUserPillType({ user: creator, opId, isMod });

  const NameColorMap: Record<
    NameType,
    { textColor: string; bgColor: string; label: string }
  > = {
    admin: {
      bgColor: theme.colors.app.users.admin,
      textColor: "#fff",
      label: "ADMIN",
    },
    mod: {
      bgColor: theme.colors.app.users.mod,
      textColor: "#fff",
      label: "MOD",
    },
    op: {
      bgColor: theme.colors.app.users.op,
      textColor: "#fff",
      label: "OP",
    },
    dev: {
      bgColor: theme.colors.app.users.dev,
      textColor: "#fff",
      label: "DEV",
    },
  };

  const nameProps = NameColorMap[type];

  return (
    <HStack space={1} alignItems="center">
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
            color={theme.colors.app.textSecondary}
            size={14}
            boxSize={22}
          />
        ))}
      {creator.bot_account && (
        <SFIcon
          icon={ICON_MAP.BOT_ACCOUNT}
          size={12}
          boxSize={20}
          color={theme.colors.app.info}
        />
      )}
      <VStack>
        <HStack space={0.5}>
          <Link
            screen="Profile"
            params={{
              fullUsername: getUserFullName(creator),
            }}
            cancel={!link}
          >
            <Text
              fontWeight="normal"
              color={type ? nameProps.bgColor : theme.colors.app.textSecondary}
            >
              {creator.name}
            </Text>
          </Link>
          {type && showPill && (
            <Chip
              text={nameProps.label}
              color={nameProps.bgColor}
              variant="filled"
            />
          )}
        </HStack>
        {showInstanceForUsernames && (
          <Text fontSize="xs" color={theme.colors.app.textPrimary}>
            {getBaseUrl(creator.actor_id)}
          </Text>
        )}
      </VStack>
      {children}
    </HStack>
  );
}

export default React.memo(AvatarUsername);

import React from "react";
import { HStack, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { IconUser } from "tabler-icons-react-native";
import { Person } from "lemmy-js-client";
import Link from "./Buttons/Link";
import { getBaseUrl } from "../../helpers/LinkHelper";
import { useAppSelector } from "../../../store";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { getUserFullName } from "../../helpers/LemmyHelpers";
import Chip from "./Chip";

export type NameType = "admin" | "mod" | "dev" | "op";

const devIds = [675207, 1113100];

function isUserDev(userId: number): boolean {
  return devIds.includes(userId);
}

function getUserPillType({
  user,
  opId,
}: {
  user: Person;
  opId?: number;
}): NameType | undefined {
  if (isUserDev(user.id)) {
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
  children?: React.ReactNode;
  link?: boolean;
}

function AvatarUsername({
  showAvatar = true,
  creator,
  opId,
  children,
  link = true,
}: IProps) {
  const { showInstanceForUsernames } = useAppSelector(selectSettings);
  const theme = useTheme();
  const type = getUserPillType({ user: creator, opId });

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
          <IconUser color={theme.colors.app.textSecondary} size={18} />
        ))}
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
          {type && (
            <Chip
              text={nameProps.label}
              color={nameProps.bgColor}
              variant="filled"
            />
          )}
        </HStack>
        {showInstanceForUsernames && (
          <Text fontSize="xs">{getBaseUrl(creator.actor_id)}</Text>
        )}
      </VStack>
      {children}
    </HStack>
  );
}

export default React.memo(AvatarUsername);

/* eslint-disable jsx-a11y/anchor-is-valid */
import { Person } from "lemmy-js-client";
import { Box, HStack, Text, useTheme, VStack } from "native-base";
import React from "react";
import FastImage from "react-native-fast-image";
import { IconUser } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getUserFullName } from "../../../lemmy/LemmyHelpers";
import Link from "../buttons/Link";

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

  // * incase we want to add a me tag back
  // if (
  //   currentAccount &&
  //   currentAccount.username &&
  //   currentAccount.instance &&
  //   comment.comment.creator.name === currentAccount?.username &&
  //   getBaseUrl(comment.comment.creator.actor_id) === currentAccount?.instance
  // ) {
  //   return "me";
  // }

  return undefined;
}

function Chip({
  text,
  bgColor,
  textColor,
}: {
  text: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <Box
      style={{
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: bgColor,
      }}
    >
      <Text
        fontWeight="bold"
        color={textColor}
        fontSize="2xs"
        mx={1.5}
        my={0.5}
      >
        {text}
      </Text>
    </Box>
  );
}

function AvatarUsername({
  creator,
  showAvatar = true,
  showInstance,
  children,
  opId,
}: {
  creator: Person;
  showAvatar?: boolean;
  showInstance?: boolean;
  children?: JSX.Element;
  opId?: number;
}) {
  const { colors } = useTheme();
  const { avatar, name, actor_id: actorId } = creator;
  const fullUsername = getUserFullName(creator);

  const type = getUserPillType({ user: creator, opId });

  const NameColorMap: Record<
    NameType,
    { textColor: string; bgColor: string; label: string }
  > = {
    admin: {
      bgColor: colors.app.users.admin,
      textColor: "#fff",
      label: "ADMIN",
    },
    mod: {
      bgColor: colors.app.users.mod,
      textColor: "#fff",
      label: "MOD",
    },
    op: {
      bgColor: colors.app.users.op,
      textColor: "#fff",
      label: "OP",
    },
    dev: {
      bgColor: colors.app.users.dev,
      textColor: "#fff",
      label: "DEV",
    },
  };

  const nameProps = NameColorMap[type];

  return (
    <HStack space={1} alignItems="center">
      {showAvatar &&
        (avatar ? (
          <FastImage
            source={{
              uri: avatar,
            }}
            style={{ height: 18, width: 18, borderRadius: 100 }}
          />
        ) : (
          <IconUser color={colors.app.textSecondary} />
        ))}
      <VStack>
        <Link
          screen="Profile"
          params={{
            fullUsername,
          }}
        >
          <Text
            fontWeight="normal"
            color={type ? nameProps.bgColor : colors.app.textSecondary}
          >
            {name}
          </Text>
        </Link>
        {showInstance && <Text fontSize="xs">{getBaseUrl(actorId)}</Text>}
      </VStack>
      {type && (
        <Chip
          text={nameProps.label}
          bgColor={nameProps.bgColor}
          textColor={nameProps.textColor}
        />
      )}
      {children}
    </HStack>
  );
}

export default AvatarUsername;

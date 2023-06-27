import { Person } from "lemmy-js-client";
import { HStack, Text, useTheme, VStack } from "native-base";
import React from "react";
import FastImage from "react-native-fast-image";
import { IconUser } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getUserFullName } from "../../../lemmy/LemmyHelpers";
import UserLink from "../buttons/UserLink";

interface AvatarUsernameProps {
  creator: Person;
  showAvatar?: boolean;
  showInstance?: boolean;
  children?: JSX.Element;
}

function AvatarUsername({
  creator,
  showAvatar = true,
  showInstance,
  children,
}: AvatarUsernameProps) {
  const { colors } = useTheme();
  const { avatar, name, actor_id: actorId } = creator;
  const fullUsername = getUserFullName(creator);

  return (
    <HStack space={2} alignItems="center">
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
        <UserLink username={name} fullUsername={fullUsername} />
        {showInstance && <Text fontSize="xs">{getBaseUrl(actorId)}</Text>}
      </VStack>
      {children}
    </HStack>
  );
}

export default AvatarUsername;

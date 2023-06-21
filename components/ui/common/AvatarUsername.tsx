import { HStack, Text, VStack, useTheme } from "native-base";
import React from "react";
import FastImage from "react-native-fast-image";
import { IconUser } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface AvatarUsernameProps {
  avatar: string;
  username: string;
  instanceName?: string;
  showInstance?: boolean;
  children?: JSX.Element;
}

function AvatarUsername({
  avatar,
  username,
  instanceName,
  showInstance,
  children,
}: AvatarUsernameProps) {
  const { colors } = useTheme();

  return (
    <HStack space={2} alignItems="center">
      {avatar ? (
        <FastImage
          source={{
            uri: avatar,
          }}
          style={{ height: 20, width: 20, borderRadius: 100 }}
        />
      ) : (
        <IconUser color={colors.app.iconColor} />
      )}
      <VStack>
        <Text fontWeight="medium">{username}</Text>
        {showInstance && <Text fontSize="xs">{getBaseUrl(instanceName)}</Text>}
      </VStack>
      {children}
    </HStack>
  );
}

export default AvatarUsername;

import React from "react";
import { HStack, Text } from "native-base";
import { Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { IconLink } from "tabler-icons-react-native";
import { openLink } from "../../../helpers/LinkHelper";
import { truncateLink } from "../../../helpers/TextHelper";

interface IMinimalLinkPreview {
  link: string;
  thumbnailUrl?: string;
  navigation: NativeStackNavigationProp<any>;
  color: string;
}

export function MinimalLinkPreview({
  link,
  thumbnailUrl,
  navigation,
  color,
}: IMinimalLinkPreview) {
  return (
    <Pressable onPress={() => openLink(link, navigation)}>
      <HStack space={2} alignItems="center">
        {thumbnailUrl ? (
          <FastImage
            resizeMode="cover"
            style={{
              width: 48,
              height: 48,
            }}
            source={{
              uri: thumbnailUrl,
            }}
          />
        ) : (
          <HStack m="2">
            <IconLink color={color} size={32} />
          </HStack>
        )}

        <Text>{truncateLink(link)}</Text>
      </HStack>
    </Pressable>
  );
}

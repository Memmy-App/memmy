import { PreviewData } from "@flyerhq/react-native-link-preview";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable } from "react-native";
import { Text, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { truncateLink } from "../../../helpers/TextHelper";
import { MinimalLinkPreview } from "./MinimalLinkPreview";
import { openLink } from "../../../helpers/LinkHelper";

function LinkTitle({ title, color }: { title?: string; color: string }) {
  if (!title) {
    return false;
  }

  return (
    <Text marginX={4} mt="4" fontWeight="bold" color={color}>
      {title}
    </Text>
  );
}

function LinkDescription({
  description,
  color,
}: {
  description?: string;
  color: string;
}) {
  if (!description) {
    return false;
  }

  return (
    <Text marginX={4} mb={4} color={color}>
      {description}
    </Text>
  );
}

interface IFullLinkPreview {
  link: string;
  data?: {
    aspectRatio?: number;
    containerWidth: number;
    previewData?: PreviewData;
  };
  navigation: NativeStackNavigationProp<any>;
  color: string;
}

export function FullLinkPreview({
  link,
  data,
  navigation,
  color,
}: IFullLinkPreview) {
  const previewData = data?.previewData;
  const thumbnailUrl = previewData?.image?.url;

  if (!previewData) {
    return (
      <MinimalLinkPreview link={link} navigation={navigation} color={color} />
    );
  }

  return (
    <Pressable onPress={() => openLink(link, navigation)}>
      <VStack space={1}>
        {thumbnailUrl && (
          <FastImage
            resizeMode="cover"
            style={{
              height: data.containerWidth / data.aspectRatio,
              width: data.containerWidth,
            }}
            source={{
              uri: thumbnailUrl,
            }}
          />
        )}

        {previewData?.title && (
          <LinkTitle title={previewData.title} color={color} />
        )}

        {previewData?.description && (
          <LinkDescription
            description={previewData.description}
            color={color}
          />
        )}

        <Text mx="4" mb="2" color={color}>
          {truncateLink(link)}
        </Text>
      </VStack>
    </Pressable>
  );
}

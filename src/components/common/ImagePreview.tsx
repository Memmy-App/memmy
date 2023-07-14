import { Box, HStack, Text } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import ImageViewer from "./ImageViewer/ImageViewer";

interface IProps {
  images: string[];
  postId: number;
  isNsfw: boolean;
  recycled?: React.MutableRefObject<{}>;
}

function ImagePreview({ images, postId, recycled, isNsfw }: IProps) {
  if (images.length === 1) {
    return (
      <ImageViewer
        sourceIndex={0}
        sources={images}
        nsfw={isNsfw}
        id={postId}
        recycled={recycled}
      />
    );
  }

  if (images.length >= 2 && images[0] !== images[1]) {
    return (
      <HStack space={1}>
        <ImageViewer
          sourceIndex={0}
          sources={images}
          nsfw={isNsfw}
          id={postId}
          recycled={recycled}
          resizeMode="cover"
          height={200}
          width={Dimensions.get("screen").width / 2}
        />
        <ImageViewer
          sourceIndex={1}
          sources={images}
          nsfw={isNsfw}
          id={postId}
          recycled={recycled}
          resizeMode="cover"
          height={200}
          width={Dimensions.get("screen").width / 2}
        />
        <Box position="absolute" right={1} bottom={1}>
          <Box
            paddingX={1}
            margin={0.5}
            backgroundColor="gray.700"
            borderRadius={5}
          >
            <Text fontSize="2xs">{images.length} IMAGES</Text>
          </Box>
        </Box>
      </HStack>
    );
  }

  return null;
}

export default ImagePreview;

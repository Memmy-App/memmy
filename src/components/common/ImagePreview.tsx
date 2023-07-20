import { Box, HStack, Text } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import ImageViewer from "./ImageViewer/ImageViewer";

interface IProps {
  images: string[];
  postId: number;
  isNsfw: boolean;
  recycled?: React.MutableRefObject<{}>;
  setPostRead?: () => void;
}

function ImagePreview({
  images,
  postId,
  recycled,
  isNsfw,
  setPostRead,
}: IProps) {
  if (images.length === 1) {
    return (
      <ImageViewer
        source={images[0]}
        nsfw={isNsfw}
        postId={postId}
        recycled={recycled}
        setPostRead={setPostRead}
      />
    );
  }

  if (images.length >= 2 && images[0] !== images[1]) {
    return (
      <HStack space={1}>
        <ImageViewer
          source={images[0]}
          nsfw={isNsfw}
          postId={postId}
          recycled={recycled}
          heightOverride={200}
          widthOverride={Dimensions.get("screen").width / 2}
          setPostRead={setPostRead}
        />
        <ImageViewer
          source={images[1]}
          nsfw={isNsfw}
          postId={postId}
          recycled={recycled}
          heightOverride={200}
          widthOverride={Dimensions.get("screen").width / 2}
          setPostRead={setPostRead}
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

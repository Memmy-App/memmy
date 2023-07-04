import { Box, HStack, Text } from "native-base";
import React from "react";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import ImageViewer from "../image/ImageViewer";

interface ISingleImageProps {
  postId: number;
  source: string;
  isNsfw: boolean;
  recycled?: React.MutableRefObject<{}>;
}

function SingleImage({ postId, source, isNsfw, recycled }: ISingleImageProps) {
  return (
    <ImageViewer
      source={source}
      nsfw={isNsfw}
      id={postId}
      recycled={recycled}
    />
  );
}

interface IProps {
  images: string[];
  postId: number;
  isNsfw: boolean;
  recycled?: React.MutableRefObject<{}>;
}

function ImagePreview({ images, postId, recycled, isNsfw }: IProps) {
  const { blurNsfw } = useAppSelector(selectSettings);

  if (images.length === 1) {
    return (
      <SingleImage
        isNsfw={isNsfw && blurNsfw}
        postId={postId}
        source={images[0]}
        recycled={recycled}
      />
    );
  }

  if (images.length >= 2) {
    return (
      <HStack space={1}>
        <SingleImage
          isNsfw={isNsfw && blurNsfw}
          postId={postId}
          source={images[0]}
        />
        <SingleImage
          isNsfw={isNsfw && blurNsfw}
          postId={postId}
          source={images[1]}
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

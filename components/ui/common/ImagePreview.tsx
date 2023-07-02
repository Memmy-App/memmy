import { Box, HStack, Pressable, Text, useTheme } from "native-base";
import React, { useState } from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import { ResizeMode } from "react-native-fast-image";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import ImageModal from "../image/ImageModal";
import MemoizedFastImage from "../image/MemoizedFastImage";

interface ISingleImageProps {
  postId: number;
  source: string;
  isNsfw: boolean;
  onImagePress: () => void;
  width?: number | string;
  height?: number | string;
  resizeMode?: ResizeMode;
  recycled?: React.MutableRefObject<{}>;
}

function SingleImage({
  postId,
  source,
  isNsfw,
  onImagePress,
  resizeMode,
  width,
  height,
  recycled,
}: ISingleImageProps) {
  const { colors } = useTheme();
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const onImageClick = () => {
    onImagePress();
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  return (
    <>
      <Pressable
        onPress={onImageClick}
        onLongPress={onImageLongPress}
        alignItems="center"
        justifyContent="center"
        // TODO figure out if this is working
        backgroundColor={colors.app.bg}
      >
        <MemoizedFastImage
          postId={postId}
          source={source}
          nsfw={isNsfw}
          imgHeight={height}
          imgWidth={width}
          resizeMode={resizeMode}
          recycled={recycled}
        />
      </Pressable>
      <ImageModal
        source={source}
        width={Dimensions.get("screen").width}
        height={Dimensions.get("screen").height}
        isOpen={imageViewOpen}
        onRequestClose={() => {
          setImageViewOpen(false);
        }}
      />
    </>
  );
}

interface IProps {
  images: string[];
  postId: number;
  isNsfw: boolean;
  onImagePress: () => void;
  recycled?: React.MutableRefObject<{}>;
}

function ImagePreview({
  images,
  postId,
  recycled,
  isNsfw,
  onImagePress,
}: IProps) {
  const { blurNsfw } = useAppSelector(selectSettings);
  const { width: windowWidth } = useWindowDimensions();

  if (images.length === 1) {
    return (
      <SingleImage
        isNsfw={isNsfw && blurNsfw}
        postId={postId}
        source={images[0]}
        onImagePress={onImagePress}
        resizeMode="contain"
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
          resizeMode="cover"
          onImagePress={onImagePress}
          width={windowWidth / 2}
          height={200}
        />
        <SingleImage
          isNsfw={isNsfw && blurNsfw}
          postId={postId}
          source={images[1]}
          resizeMode="cover"
          onImagePress={onImagePress}
          width={windowWidth / 2}
          height={200}
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

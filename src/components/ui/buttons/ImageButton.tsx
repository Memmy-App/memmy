import React, { useState } from "react";
import {
  ChevronRightIcon,
  HStack,
  Pressable,
  Spacer,
  Text,
  useTheme,
} from "native-base";
import FastImage from "react-native-fast-image";
import { truncateImageLink } from "../../../helpers/TextHelper";
import ImageViewer from "../image/ImageViewer";

interface ImageButtonProps {
  src: string;
}

function ImageButton({ src }: ImageButtonProps) {
  const [visible, setVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const theme = useTheme();

  const onPress = () => {
    setVisible(true);
  };

  const onRequestClose = () => {
    setVisible(false);
  };

  const onLoad = (e) => {
    setDimensions({
      height: e.nativeEvent.height,
      width: e.nativeEvent.width,
    });
  };

  return (
    <>
      <Pressable onPress={onPress}>
        <HStack
          backgroundColor={theme.colors.app.bg}
          borderRadius={5}
          padding={2}
          flexDirection="row"
          alignItems="center"
          space={2}
          my={4}
        >
          <FastImage
            style={{
              height: 50,
              width: 50,
            }}
            resizeMode="contain"
            source={{
              uri: src,
            }}
            onLoad={onLoad}
          />
          <Spacer />
          <Text color={theme.colors.app.textPrimary}>
            {truncateImageLink(src)}
          </Text>
          <Spacer />
          <ChevronRightIcon />
        </HStack>
      </Pressable>

      <ImageViewer
        source={src}
        nsfw={false}
        onlyViewer
        visibleOverride={visible}
        onRequestCloseOverride={onRequestClose}
        heightOverride={dimensions.height}
        widthOverride={dimensions.width}
      />
    </>
  );
}

export default ImageButton;

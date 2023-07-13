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
import ImageViewer from "../ImageViewer/ImageViewer";

interface ImageButtonProps {
  src: string;
  size?: number;
  marginY?: number;
}

function ImageButton({ src, size = 50, marginY = 4 }: ImageButtonProps) {
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
          my={marginY}
        >
          <FastImage
            style={{
              height: size,
              width: size,
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
        source={[src]}
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

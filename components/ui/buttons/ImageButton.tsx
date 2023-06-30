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
import { Dimensions } from "react-native";
import { truncateImageLink } from "../../../helpers/TextHelper";
import ImageModal from "../image/ImageModal";

interface ImageButtonProps {
  src: string;
}

function ImageButton({ src }: ImageButtonProps) {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();

  const onPress = () => {
    setVisible(true);
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
          />
          <Spacer />
          <Text color={theme.colors.app.textPrimary}>
            {truncateImageLink(src)}
          </Text>
          <Spacer />
          <ChevronRightIcon />
        </HStack>
      </Pressable>

      <ImageModal
        source={src}
        onRequestClose={() => setVisible(false)}
        isOpen={visible}
        width={Dimensions.get("screen").width}
        height={Dimensions.get("screen").height}
      />
    </>
  );
}

export default ImageButton;

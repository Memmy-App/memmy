import React, { useState } from "react";
import {
  ChevronRightIcon,
  HStack,
  Pressable,
  Spacer,
  Text,
  useTheme,
} from "native-base";
import { ImageDetail } from "@dreamwalk-os/react-native-image-modal";
import FastImage from "react-native-fast-image";
import { Dimensions, Share } from "react-native";
import { truncateImageLink } from "../../../helpers/TextHelper";
import ImageViewFooter from "../image/ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";

interface ImageButtonProps {
  src: string;
}

function ImageButton({ src }: ImageButtonProps) {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();

  const onPress = () => {
    setVisible(true);
    console.log("sup");
  };

  const onShare = () => {
    Share.share({
      url: src,
    });
  };

  const onSave = () => {
    downloadAndSaveImage(src).then();
  };

  return (
    <>
      <Pressable onPress={onPress}>
        <HStack
          backgroundColor={theme.colors.app.backgroundTricondary}
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
          <Text color={theme.colors.app.primaryText}>
            {truncateImageLink(src)}
          </Text>
          <Spacer />
          <ChevronRightIcon />
        </HStack>
      </Pressable>

      <ImageDetail
        source={{ uri: src }}
        origin={{
          x: Dimensions.get("window").width / 2,
          y: Dimensions.get("window").height / 2,
          width: 100,
          height: 100,
        }}
        resizeMode="contain"
        swipeToDismiss
        onClose={() => setVisible(false)}
        isOpen={visible}
        renderFooter={() => (
          <ImageViewFooter onShare={onShare} onSave={onSave} />
        )}
      />
    </>
  );
}

export default ImageButton;

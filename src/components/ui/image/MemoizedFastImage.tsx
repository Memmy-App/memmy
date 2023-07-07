import React, { useRef, useState } from "react";
import FastImage, { ResizeMode } from "react-native-fast-image";
import { Icon, Text, useTheme, View, VStack } from "native-base";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { getRatio } from "../../../helpers/ImageHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../../store";

function MemoizedFastImage({
  postId,
  source,
  recycled,
  nsfw = false,
  imgHeight,
  imgWidth,
  resizeMode = "contain",
  onLoad,
}: {
  postId: number;
  source: string;
  recycled?: React.MutableRefObject<{}> | undefined;
  nsfw?: boolean;
  resizeMode?: ResizeMode;
  imgHeight?: number | string;
  imgWidth?: number | string;
  onLoad?: (e) => void;
}) {
  const theme = useTheme();

  const { ignoreScreenHeightInFeed } = useAppSelector(selectSettings);

  const [height, setHeight] = useState<string | number>(0);
  const [width, setWidth] = useState<string | number>(0);
  const [blurIntensity, setBlurIntensity] = useState(99);

  const lastPostId = useRef(postId);

  if (recycled && postId !== lastPostId.current) {
    recycled.current = {
      ...recycled.current,
      [lastPostId.current]: {
        height,
        width,
      },
    };

    if (recycled.current[postId]) {
      setHeight(recycled.current[postId].height);
      setWidth(recycled.current[postId].width);
    }

    lastPostId.current = postId;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _onLoad = (e) => {
    if (onLoad) onLoad(e);

    if (imgHeight && imgWidth) {
      setHeight(imgHeight);
      setWidth(imgWidth);
    }

    if (!imgHeight && !imgWidth) {
      const { imageHeight, imageWidth } = getRatio(
        e.nativeEvent.height,
        e.nativeEvent.width,
        ignoreScreenHeightInFeed ? 0.9 : 0.6
      );

      setHeight(imageHeight);
      setWidth(imageWidth);
      setBlurIntensity((prev) => (prev === 99 ? 100 : 99));
    }
  };

  if (nsfw) {
    return (
      <View style={styles.blurContainer}>
        <BlurView
          style={[
            styles.blurView,
            { height: imgHeight ?? height, width: imgWidth ?? width },
          ]}
          intensity={blurIntensity}
          tint={theme.config.initialColorMode}
        >
          <VStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            space={2}
          >
            <Icon
              as={Ionicons}
              name="alert-circle"
              color={theme.colors.app.textSecondary}
              size={16}
            />
            <Text fontSize="xl">NSFW</Text>
            <Text>Sensitive content ahead</Text>
          </VStack>
        </BlurView>
        {!source.includes(".gif") && (
          <FastImage
            resizeMode={resizeMode}
            source={{
              uri: source,
            }}
            style={{
              height,
              width,
            }}
            onLoad={_onLoad}
          />
        )}
      </View>
    );
  }

  return (
    <FastImage
      resizeMode={resizeMode}
      source={{
        uri: source,
      }}
      style={{
        height,
        width,
      }}
      onLoad={_onLoad}
    />
  );
}

const styles = StyleSheet.create({
  blurView: {
    position: "absolute",
    zIndex: 1,
  },

  blurContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MemoizedFastImage;

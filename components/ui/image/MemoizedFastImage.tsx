import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FastImage from "react-native-fast-image";
import { Icon, Text, useTheme, View, VStack } from "native-base";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useModeManager } from "native-base/lib/typescript/core/color-mode/hooks";
import { getRatio } from "../../../helpers/ImageHelper";

function MemoizedFastImage({
  postId,
  source,
  recycled,
  nsfw = false,
}: {
  postId: number;
  source: string;
  recycled?: React.MutableRefObject<{}> | undefined;
  nsfw?: boolean;
}) {
  const theme = useTheme();

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [blurIntensity, setBlurIntensity] = useState(99);

  useEffect(() => {
    setBlurIntensity(100);
  }, [height]);

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

  const onLoad = (e) => {
    const { imageHeight, imageWidth } = getRatio(
      e.nativeEvent.height,
      e.nativeEvent.width
    );

    setHeight(imageHeight);
    setWidth(imageWidth);
  };

  if (nsfw) {
    return useMemo(
      () => (
        <View style={styles.blurContainer}>
          <BlurView
            style={[styles.blurView, { height, width }]}
            intensity={blurIntensity}
            tint="dark"
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
                color={theme.colors.app.primaryText}
                size={16}
              />
              <Text fontSize="xl">NSFW</Text>
              <Text>Sensitive content ahead</Text>
            </VStack>
          </BlurView>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: source,
            }}
            style={{
              height,
              width,
            }}
            onLoad={onLoad}
          />
        </View>
      ),
      [height, source]
    );
  }

  return useMemo(
    () => (
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: source,
        }}
        style={{
          height,
          width,
        }}
        onLoad={onLoad}
      />
    ),
    [height, source]
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

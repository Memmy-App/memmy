import React, { useMemo, useRef, useState } from "react";
import { PostView } from "lemmy-js-client";
import { Icon, Pressable, Text, useTheme, View, VStack } from "native-base";
import { Dimensions, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BlurView } from "expo-blur";
import FastImage from "react-native-fast-image";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { ExtensionType, getLinkInfo } from "../../helpers/LinkHelper";
import { truncatePost } from "../../helpers/TextHelper";
import LinkButton from "./buttons/LinkButton";
import RenderMarkdown from "./markdown/RenderMarkdown";
import { useAppSelector } from "../../store";
import { selectSettings } from "../../slices/settings/settingsSlice";
import ImageModal from "./image/ImageModal";
import nestedComment from "../../lemmy/comments/NestedComment";
import { getRatio } from "../../helpers/ImageHelper";

interface ContentViewProps {
  post: PostView;
  truncate?: boolean;
  showBody?: boolean;
  showTitle?: boolean;
  recycled: React.MutableRefObject<{}>;
}

function ContentView({
  post,
  truncate = false,
  showBody = false,
  showTitle = false,
  recycled,
}: ContentViewProps) {
  const theme = useTheme();

  const { blurNsfw } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);

  const body = truncate ? truncatePost(post.post.body, 100) : post.post.body;
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [height, setHeight] = useState<string | number>(0);
  const [width, setWidth] = useState<string | number>(0);

  const lastPostId = useRef(post.post.id);

  if (post.post.id !== lastPostId.current) {
    if (recycled.current[post.post.id]) {
      setHeight(recycled.current[post.post.id].height);
      setWidth(recycled.current[post.post.id].width);
    }

    recycled.current = {
      ...recycled.current,
      [lastPostId.current]: {
        height,
        width,
      },
    };

    lastPostId.current = post.post.id;
  }

  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  const view = useMemo(
    () => (
      <>
        {linkInfo.extType === ExtensionType.IMAGE && (
          <VStack mb={3}>
            {post.post.nsfw && blurNsfw ? (
              <Pressable onPress={onImagePress} onLongPress={onImageLongPress}>
                <View style={styles.blurContainer}>
                  <BlurView style={styles.blurView} intensity={100} tint="dark">
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
                      uri: post.post.url,
                    }}
                    style={{
                      height,
                      width,
                    }}
                    onLoad={(e) => {
                      const { imageHeight, imageWidth } = getRatio(
                        e.nativeEvent.height,
                        e.nativeEvent.width
                      );

                      setHeight(imageHeight);
                      setWidth(imageWidth);
                    }}
                  />
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={onImagePress}
                onLongPress={onImageLongPress}
                alignItems="center"
                justifyContent="center"
              >
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: post.post.url,
                  }}
                  style={{
                    height,
                    width,
                  }}
                  onLoad={(e) => {
                    const { imageHeight, imageWidth } = getRatio(
                      e.nativeEvent.height,
                      e.nativeEvent.width
                    );

                    setHeight(imageHeight);
                    setWidth(imageWidth);
                  }}
                />
              </Pressable>
            )}
            {/* <ImageView */}
            {/*  source={post.post.url} */}
            {/*  setIsOpen={setImageViewOpen} */}
            {/*  isOpen={imageViewOpen} */}
            {/* /> */}
            <ImageModal
              source={post.post.url}
              width={Dimensions.get("screen").width}
              height={Dimensions.get("screen").height}
              isOpen={imageViewOpen}
              onRequestClose={() => setImageViewOpen(false)}
            />
          </VStack>
        )}

        {showTitle && (
          <Text fontSize="lg" mt={3} mx={4} mb={1}>
            {post.post.name}
          </Text>
        )}

        {(linkInfo.extType === ExtensionType.NONE || showBody) && (
          <VStack px={4}>
            <RenderMarkdown
              text={body}
              addImages={showTitle}
              truncate={truncate}
            />
          </VStack>
        )}
        {(linkInfo.extType === ExtensionType.VIDEO && (
          <LinkButton
            link={linkInfo.link}
            thumbnail={post.post.thumbnail_url}
          />
        )) ||
          (linkInfo.extType === ExtensionType.GENERIC && (
            <LinkButton
              link={linkInfo.link}
              thumbnail={post.post.thumbnail_url}
            />
          ))}
      </>
    ),
    [post, imageViewOpen, height]
  );
  return view;
}

const styles = StyleSheet.create({
  blurView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 1,
  },

  blurContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
  },
});

export default ContentView;

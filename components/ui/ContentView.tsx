import React, { useMemo, useState } from "react";
import { PostView } from "lemmy-js-client";
import { Icon, Pressable, Text, View, VStack } from "native-base";
import { Dimensions, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BlurView } from "expo-blur";
import FastImage from "react-native-fast-image";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { ExtensionType, getLinkInfo } from "../../helpers/LinkHelper";
import { truncatePost } from "../../helpers/TextHelper";
import LinkButton from "./LinkButton";
import RenderMarkdown from "./markdown/RenderMarkdown";
import { useAppSelector } from "../../store";
import { selectSettings } from "../../slices/settings/settingsSlice";
import ImageView from "./image/ImageView";

interface ContentViewProps {
  post: PostView;
  truncate?: boolean;
  showBody?: boolean;
  showTitle?: boolean;
}

function ContentView({
  post,
  truncate = false,
  showBody = false,
  showTitle = false,
}: ContentViewProps) {
  const { blurNsfw } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);

  const body = truncate ? truncatePost(post.post.body, 200) : post.post.body;
  const [imageViewOpen, setImageViewOpen] = useState(false);

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
                        color="white"
                        size={16}
                      />
                      <Text fontSize="xl">NSFW</Text>
                      <Text>Sensitive content ahead</Text>
                    </VStack>
                  </BlurView>
                  <FastImage
                    resizeMode="contain"
                    style={styles.image}
                    source={{
                      uri: post.post.url,
                    }}
                  />
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={onImagePress} onLongPress={onImageLongPress}>
                <FastImage
                  resizeMode="contain"
                  style={styles.image}
                  source={{
                    uri: post.post.url,
                  }}
                />
              </Pressable>
            )}
            <ImageView
              source={post.post.url}
              setIsOpen={setImageViewOpen}
              isOpen={imageViewOpen}
            />
          </VStack>
        )}

        {showTitle && (
          <Text fontSize="xl" fontWeight="semibold" mt={5} mx={4} mb={4}>
            {post.post.name}
          </Text>
        )}

        {(linkInfo.extType === ExtensionType.NONE || showBody) && (
          <VStack px={4}>
            <RenderMarkdown text={body} addImages={showTitle} />
          </VStack>
        )}

        {(linkInfo.extType === ExtensionType.VIDEO && (
          <LinkButton link={linkInfo.link} />
        )) ||
          (linkInfo.extType === ExtensionType.GENERIC && (
            <LinkButton link={linkInfo.link} />
          ))}
      </>
    ),
    [post, imageViewOpen]
  );
  return view;
}

const styles = StyleSheet.create({
  image: {
    height: 350,
    width: Dimensions.get("screen").width,
  },

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

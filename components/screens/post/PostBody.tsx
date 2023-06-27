import { PostView } from "lemmy-js-client";
import { Icon, Pressable, Text, useTheme, View, VStack } from "native-base";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BlurView } from "expo-blur";
import FastImage from "react-native-fast-image";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import LinkButton from "../../ui/buttons/LinkButton";
import RenderMarkdown from "../../ui/markdown/RenderMarkdown";
import ImageModal from "../../ui/image/ImageModal";

interface PostBodyProps {
  post: PostView;
}

function PostBody({ post }: PostBodyProps) {
  const { blurNsfw } = useAppSelector(selectSettings);
  const theme = useTheme();

  const linkInfo = getLinkInfo(post.post.url);
  const showLink =
    linkInfo.extType === ExtensionType.VIDEO ||
    linkInfo.extType === ExtensionType.GENERIC;

  const { body } = post.post;
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  moment.updateLocale("en", {
    relativeTime: {
      hh: "%dh",
      dd: "%dd",
    },
  });

  // memoize component instead?
  const view = useMemo(
    () => (
      <>
        {linkInfo.extType === ExtensionType.IMAGE && (
          <VStack mb={3}>
            {(post.post.nsfw || post.community.nsfw) && blurNsfw ? (
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
                        color={theme.colors.app.textPrimary}
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
            <ImageModal
              source={post.post.url}
              onRequestClose={() => setImageViewOpen(false)}
              isOpen={imageViewOpen}
              width={Dimensions.get("screen").width}
              height={Dimensions.get("screen").height}
            />
          </VStack>
        )}

        <Text flex={4} fontSize="lg">
          {post.post.name}
        </Text>

        {linkInfo.extType === ExtensionType.NONE && (
          <VStack px={4}>
            <RenderMarkdown text={body} />
          </VStack>
        )}

        {showLink && <LinkButton link={linkInfo.link} />}
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

export default PostBody;

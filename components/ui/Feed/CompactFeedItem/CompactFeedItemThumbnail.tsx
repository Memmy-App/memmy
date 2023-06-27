import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Box, Icon, Pressable, useTheme, View, VStack } from "native-base";
import { PostView } from "lemmy-js-client";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { IconLink, IconMessages } from "tabler-icons-react-native";
import { ExtensionType, LinkInfo } from "../../../../helpers/LinkHelper";
import ImageModal from "../../image/ImageModal";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";

function CompactFeedItemThumbnail({
  post,
  linkInfo,
  setImageViewOpen,
  imageViewOpen,
}: {
  post: PostView;
  linkInfo: LinkInfo;
  setImageViewOpen: (open: boolean) => void;
  imageViewOpen: boolean;
}) {
  const theme = useTheme();

  const { blurNsfw } = useAppSelector(selectSettings);

  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  return (
    <Box
      width={75}
      height={75}
      backgroundColor={theme.colors.app.bgTertiary}
      borderRadius={10}
      justifyContent="center"
      alignItems="center"
      alignSelf="center"
    >
      {(linkInfo.extType === ExtensionType.IMAGE && (
        <>
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
                      size={12}
                      alignSelf="center"
                      style={styles.nsfwIcon}
                    />
                  </VStack>
                </BlurView>
                <FastImage
                  resizeMode="cover"
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
                resizeMode="cover"
                style={styles.image}
                source={{
                  uri: post.post.url,
                }}
              />
            </Pressable>
          )}
          <ImageModal
            source={post.post.url}
            width={Dimensions.get("screen").width}
            height={Dimensions.get("screen").height}
            isOpen={imageViewOpen}
            onRequestClose={() => {
              setImageViewOpen(false);
            }}
          />
        </>
      )) ||
        (linkInfo.extType === ExtensionType.NONE && (
          <IconMessages size={40} color={theme.colors.app.textSecondary} />
        )) || (
          <>
            {(post.post.thumbnail_url && (
              <>
                <FastImage
                  resizeMode="cover"
                  style={[styles.image, { opacity: 0.4 }]}
                  source={{
                    uri: post.post.thumbnail_url,
                  }}
                />
                <View zIndex={1} position="absolute">
                  <IconLink size={40} color={theme.colors.app.textSecondary} />
                </View>
              </>
            )) || <IconLink size={40} color={theme.colors.app.textSecondary} />}
          </>
        )}
    </Box>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75,
    borderRadius: 10,
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
    borderRadius: 10,
  },

  nsfwIcon: {
    marginLeft: 5,
  },
});

export default CompactFeedItemThumbnail;

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Icon, Pressable, useTheme, View, VStack } from "native-base";
import { PostView } from "lemmy-js-client";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { IconLink, IconMessages } from "tabler-icons-react-native";
import EnhancedImageViewing from "@gkasdorf/react-native-image-viewing";
import { ExtensionType, LinkInfo } from "../../../../../helpers/LinkHelper";
import { useAppSelector } from "../../../../../../store";
import { selectSettings } from "../../../../../slices/settings/settingsSlice";

import { lemmyAuthToken, lemmyInstance } from "../../../../../LemmyInstance";
import ImageViewFooter from "../../../../ui/ImageViewer/ImageViewFooter";
import downloadAndSaveImage from "../../../../../helpers/ImageHelper";
import { shareLink } from "../../../../../helpers/ShareHelper";

function CompactFeedItemThumbnail({
  post,
  linkInfo,
  setImageViewOpen,
  imageViewOpen,
  setPostRead,
}: {
  post: PostView;
  linkInfo: LinkInfo;
  setImageViewOpen: (open: boolean) => void;
  imageViewOpen: boolean;
  setPostRead: () => void;
}) {
  const theme = useTheme();

  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const onImagePress = () => {
    setImageViewOpen(true);
    lemmyInstance
      .markPostAsRead({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        read: true,
      })
      .then();
    if (setPostRead && markReadOnPostImageView) {
      setPostRead();
    }
  };

  const onRequestClose = () => {
    setImageViewOpen(false);
  };

  const onImageLongPress = () => {};

  const onLoad = (e) => {
    setDimensions({
      height: e.nativeEvent.height,
      width: e.nativeEvent.width,
    });
  };

  const onSave = () => {
    downloadAndSaveImage(post.post.url);
  };

  const onShare = () => {
    shareLink({
      link: post.post.url,
    });
  };

  const imageViewFooter = () => (
    <ImageViewFooter onSave={onSave} onShare={onShare} />
  );

  return (
    <Box
      width={75}
      height={75}
      backgroundColor={theme.colors.app.bg}
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
                <BlurView
                  style={styles.blurView}
                  intensity={100}
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
                  onLoad={onLoad}
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
                onLoad={onLoad}
              />
            </Pressable>
          )}
          <EnhancedImageViewing
            images={[{ uri: post.post.url }]}
            imageIndex={0}
            visible={imageViewOpen}
            onRequestClose={onRequestClose}
            height={dimensions.height}
            width={dimensions.width}
            FooterComponent={imageViewFooter}
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
                  style={[styles.image]}
                  source={{
                    uri: post.post.thumbnail_url,
                  }}
                />
                <View
                  zIndex={1}
                  position="absolute"
                  bottom={1}
                  right={1}
                  style={styles.circle}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconLink size={16} color="#333" />
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

  circle: {
    height: 24,
    width: 24,
    borderRadius: 100 / 2,
    backgroundColor: "white",
    opacity: 0.8,
  },
});

export default CompactFeedItemThumbnail;

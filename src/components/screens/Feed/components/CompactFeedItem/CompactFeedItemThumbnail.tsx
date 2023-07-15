import React from "react";
import { StyleSheet } from "react-native";
import { Box, Icon, useTheme, View, VStack } from "native-base";
import { PostView } from "lemmy-js-client";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { IconLink, IconMessages } from "tabler-icons-react-native";
import { ExtensionType, LinkInfo } from "../../../../../helpers/LinkHelper";
import { useAppSelector } from "../../../../../../store";
import { selectSettings } from "../../../../../slices/settings/settingsSlice";

import { lemmyAuthToken, lemmyInstance } from "../../../../../LemmyInstance";
import ImageViewer from "../../../../common/ImageViewer/ImageViewer";

function CompactFeedItemThumbnail({
  post,
  linkInfo,
  setPostRead,
}: {
  post: PostView;
  linkInfo: LinkInfo;
  setPostRead: () => void;
}) {
  const theme = useTheme();

  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);

  const onImagePress = () => {
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
            <>
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
                <ImageViewer
                  source={{ uri: post.post.url }}
                  heightOverride={75}
                  widthOverride={75}
                  style={{
                    borderRadius: 10,
                  }}
                  onPress={onImagePress}
                />
              </View>
            </>
          ) : (
            <ImageViewer
              source={{ uri: post.post.url }}
              heightOverride={75}
              widthOverride={75}
              style={{
                borderRadius: 10,
              }}
              onPress={onImagePress}
            />
          )}
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
                  style={{
                    height: 75,
                    width: 75,
                    borderRadius: 10,
                  }}
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

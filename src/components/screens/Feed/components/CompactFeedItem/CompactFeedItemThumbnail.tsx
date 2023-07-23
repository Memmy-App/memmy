import FastImage from "@gkasdorf/react-native-fast-image";
import { PostView } from "lemmy-js-client";
import { Box, Pressable, useTheme, View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../../../../store";
import {
  ExtensionType,
  LinkInfo,
  openLink,
} from "../../../../../helpers/LinkHelper";
import { selectSettings } from "../../../../../slices/settings/settingsSlice";

import { lemmyAuthToken, lemmyInstance } from "../../../../../LemmyInstance";
import SFIcon from "../../../../common/icons/SFIcon";
import ImageViewer from "../../../../common/ImageViewer/ImageViewer";
import { ICON_MAP } from "../../../../../constants/IconMap";

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
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { markReadOnPostImageView } = useAppSelector(selectSettings);

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

  const onLinkPress = () => {
    if (!post.post.url) return;

    openLink(post.post.url, navigation, theme.colors.app.bg);
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
          <ImageViewer
            source={post.post.url}
            heightOverride={75}
            widthOverride={75}
            style={{
              borderRadius: 10,
            }}
            onPress={onImagePress}
            nsfw={post.post.nsfw || post.community.nsfw}
            compactMode
          />
        </>
      )) ||
        (linkInfo.extType === ExtensionType.NONE && (
          <SFIcon
            icon={ICON_MAP.MOST_COMMENTS}
            color={theme.colors.app.textSecondary}
            size={20}
          />
        )) || (
          <Pressable onPress={onLinkPress}>
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
                  <SFIcon icon={ICON_MAP.LINK} color="#333" size={8} />
                </View>
              </>
            )) || (
              <SFIcon
                icon="link"
                color={theme.colors.app.textSecondary}
                size={20}
              />
            )}
          </Pressable>
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

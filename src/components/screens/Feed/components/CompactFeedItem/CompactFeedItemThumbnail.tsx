import FastImage from "@gkasdorf/react-native-fast-image";
import { Box, Pressable, View } from "@src/components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/core";
import {
  useFeedPostCommunity,
  useFeedPostInfo,
  useFeedPostRead,
} from "@src/stores/feeds/feedsStore";
import setFeedRead from "@src/stores/feeds/actions/setFeedRead";
import { ExtensionType, LinkInfo, openLink } from "@src/helpers/LinkHelper";

import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { ICON_MAP } from "@src/constants/IconMap";
import ImageViewer from "@src/components/common/ImageViewer/ImageViewer";
import SFIcon from "@src/components/common/icons/SFIcon";

interface IProps {
  postId: number;
  linkInfo: LinkInfo;
}

function CompactFeedItemThumbnail({ postId, linkInfo }: IProps) {
  const { key } = useRoute();

  const postRead = useFeedPostRead(key, postId);
  const postInfo = useFeedPostInfo(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);

  const theme = useAppSelector(selectThemeOptions);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { markReadOnPostImageView } = useAppSelector(selectSettings);

  const setPostRead = useCallback(() => {
    if (postRead) return;

    setFeedRead(key, postId);
  }, [postId, postRead]);

  const onImagePress = useCallback(() => {
    lemmyInstance
      .markPostAsRead({
        auth: lemmyAuthToken,
        post_id: postId,
        read: true,
      })
      .then();
    if (setPostRead && markReadOnPostImageView) {
      setPostRead();
    }
  }, [postId]);

  const onLinkPress = useCallback(() => {
    if (!postInfo.url) return;

    openLink(postInfo.url, navigation, theme.colors.bg);
  }, [postId]);

  return (
    <Box
      sx={{ h: 75, w: 75, bg: theme.colors.bg }}
      borderRadius="$xl"
      justifyContent="center"
      alignItems="center"
      alignSelf="center"
    >
      {(linkInfo.extType === ExtensionType.IMAGE && (
        <>
          <ImageViewer
            source={postInfo.url}
            heightOverride={75}
            widthOverride={75}
            style={{
              borderRadius: 10,
            }}
            onPress={onImagePress}
            nsfw={postInfo.nsfw || postCommunity.nsfw}
            compactMode
          />
        </>
      )) ||
        (linkInfo.extType === ExtensionType.NONE && (
          <SFIcon
            icon={ICON_MAP.MOST_COMMENTS}
            color={theme.colors.textSecondary}
            size={20}
          />
        )) || (
          <Pressable onPress={onLinkPress}>
            {(postInfo.thumbnail_url && (
              <>
                <FastImage
                  resizeMode="cover"
                  style={{
                    height: 75,
                    width: 75,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: postInfo.thumbnail_url,
                  }}
                />
                <View
                  zIndex={1}
                  position="absolute"
                  bottom="$1"
                  right="$1"
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
                color={theme.colors.textSecondary}
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

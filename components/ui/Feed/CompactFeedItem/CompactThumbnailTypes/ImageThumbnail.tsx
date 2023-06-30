import React from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import { PostView } from "lemmy-js-client";
import { Icon, VStack, View, useTheme } from "native-base";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import {
  lemmyAuthToken,
  lemmyInstance,
} from "../../../../../lemmy/LemmyInstance";
import ImageModal from "../../../image/ImageModal";
import ThumbnailBox from "./CompactThumbnailBox";

interface IProps {
  post: PostView;
  setImageViewOpen: (open: boolean) => void;
  imageViewOpen: boolean;
  setPostRead: () => void;
  blurNsfw: boolean;
  markReadOnPostImageView: boolean;
}

// Thumbnail for image posts
function ImageThumbnail({
  post,
  setImageViewOpen,
  imageViewOpen,
  setPostRead,
  blurNsfw,
  markReadOnPostImageView,
}: IProps) {
  const { colors } = useTheme();

  const onImagePress = () => {
    setImageViewOpen(true);
    lemmyInstance.markPostAsRead({
      auth: lemmyAuthToken,
      post_id: post.post.id,
      read: true,
    });
    if (setPostRead && markReadOnPostImageView) {
      setPostRead();
    }
  };

  const onImageLongPress = () => {};

  return (
    <ThumbnailBox>
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
                  color={colors.app.textPrimary}
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
    </ThumbnailBox>
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

export default ImageThumbnail;

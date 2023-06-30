import { PostView } from "lemmy-js-client";
import { View, useTheme } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { IconLink } from "tabler-icons-react-native";
import ThumbnailBox from "./CompactThumbnailBox";

// Post with a link that also has a thumbnail
function LinkWithThumbnail({ post }: { post: PostView }) {
  const { colors } = useTheme();

  return (
    <ThumbnailBox>
      <FastImage
        resizeMode="cover"
        style={[styles.image, { opacity: 0.4 }]}
        source={{
          uri: post.post.thumbnail_url,
        }}
      />
      <View zIndex={1} position="absolute">
        <IconLink size={40} color={colors.app.textSecondary} />
      </View>
    </ThumbnailBox>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75,
    borderRadius: 10,
  },
});

export default LinkWithThumbnail;

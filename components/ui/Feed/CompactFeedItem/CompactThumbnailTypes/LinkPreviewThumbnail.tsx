import React from "react";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { View, useTheme } from "native-base";
import { IconLink } from "tabler-icons-react-native";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { LinkInfo } from "../../../../../helpers/LinkHelper";
import ThumbnailBox from "./CompactThumbnailBox";

interface IProp {
  linkInfo: LinkInfo;
}

// Post with a link that collects a thumbnail from the link if possible
function LinkPreviewThumbnail({ linkInfo }: IProp) {
  const { colors } = useTheme();

  const { link } = linkInfo;

  if (!link) {
    return (
      <ThumbnailBox>
        <IconLink size={40} color={colors.app.textSecondary} />;
      </ThumbnailBox>
    );
  }

  return (
    <LinkPreview
      text={link}
      renderLinkPreview={(image) => {
        if (image.previewData?.image?.url) {
          return (
            <ThumbnailBox>
              <FastImage
                resizeMode="cover"
                style={[styles.image, { opacity: 0.4 }]}
                source={{
                  uri: image.previewData.image.url,
                }}
              />
              <View zIndex={1} position="absolute">
                <IconLink size={40} color={colors.app.textSecondary} />
              </View>
            </ThumbnailBox>
          );
        }
        return (
          <ThumbnailBox>
            <IconLink size={40} color={colors.app.textSecondary} />
          </ThumbnailBox>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75,
    borderRadius: 10,
  },
});

export default LinkPreviewThumbnail;

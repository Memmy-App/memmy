import { PostView } from "lemmy-js-client";
import { Box, Pressable, Text, VStack, useTheme } from "native-base";
import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import { truncatePost } from "../../../helpers/TextHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import LinkButton from "../buttons/LinkButton";
import ImageModal from "../image/ImageModal";
import MemoizedFastImage from "../image/MemoizedFastImage";

import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { findImages } from "../../../helpers/MarkdownHelper";

function Title({
  title,
  mt,
  mb,
  isRead,
}: {
  title: string;
  mt: number;
  mb: number;
  isRead?: boolean;
}) {
  const theme = useTheme();
  return (
    <Text
      mt={mt}
      mb={mb}
      mx={4}
      fontSize="md"
      color={
        isRead ? theme.colors.app.textSecondary : theme.colors.app.textPrimary
      }
    >
      {title}
    </Text>
  );
}

interface IProps {
  post: PostView;
  recycled?: React.MutableRefObject<{}>;
  setPostRead?: () => void;
}

function FeedContentPreview({ post, recycled, setPostRead }: IProps) {
  const theme = useTheme();
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);
  const { cleanedText, imageLinks } = findImages(post.post.body);
  const body = truncatePost(cleanedText, 100);

  const title = post.post.name;
  let postUrl = post.post.url;

  const [imageViewOpen, setImageViewOpen] = useState(false);

  const onImagePress = () => {
    setImageViewOpen(true);
    if (setPostRead && markReadOnPostImageView) {
      setPostRead();
      lemmyInstance.markPostAsRead({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        read: true,
      });
    }
  };

  const onImageLongPress = () => {};

  const isImage = linkInfo.extType === ExtensionType.IMAGE;
  const isRead = post.read;

  // handle weird posts where someone just posts a markdown image instead of an image post
  const hasImages = imageLinks.length > 0;
  const isImageMarkdownPost = !cleanedText && hasImages;
  if (hasImages) {
    // TODO: make work with multiple images?
    postUrl = imageLinks[0];
  }

  const renderContent = () => {
    if (isImage || isImageMarkdownPost) {
      return (
        <VStack>
          <Title title={title} mt={0} mb={2} isRead={isRead} />
          <Pressable
            onPress={onImagePress}
            onLongPress={onImageLongPress}
            alignItems="center"
            justifyContent="center"
            // TODO figure out if this is working
            backgroundColor={theme.colors.app.bg}
          >
            <MemoizedFastImage
              postId={post.post.id}
              source={postUrl}
              recycled={recycled}
              nsfw={post.post.nsfw && blurNsfw}
            />
          </Pressable>
          <ImageModal
            source={postUrl}
            width={Dimensions.get("screen").width}
            height={Dimensions.get("screen").height}
            isOpen={imageViewOpen}
            onRequestClose={() => {
              setImageViewOpen(false);
            }}
          />
        </VStack>
      );
    }

    if (linkInfo.extType === ExtensionType.NONE) {
      return (
        <VStack>
          <Title title={title} mt={0} mb={2} isRead={isRead} />
          <Text color={theme.colors.app.textSecondary} mx={4}>
            {body}
          </Text>
        </VStack>
      );
    }

    if (
      linkInfo.extType === ExtensionType.VIDEO ||
      linkInfo.extType === ExtensionType.GENERIC
    ) {
      return (
        <VStack>
          <Title title={title} mt={2} mb={2} isRead={isRead} />
          <Box mx={4}>
            <LinkButton
              link={linkInfo.link}
              thumbnail={post.post.thumbnail_url}
            />
          </Box>
        </VStack>
      );
    }

    return null;
  };

  return useMemo(
    () => <Box mb={1}>{renderContent()}</Box>,
    [post.post.id, post.read, imageViewOpen]
  );
}

export default FeedContentPreview;

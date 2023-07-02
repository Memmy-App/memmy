import { PostView } from "lemmy-js-client";
import { Box, Text, VStack, useTheme } from "native-base";
import React, { memo } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import { truncatePost } from "../../../helpers/TextHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import LinkButton from "../buttons/LinkButton";

import { findImages } from "../../../helpers/MarkdownHelper";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import ImagePreview from "../common/ImagePreview";

function Title({ title, mt, mb }: { title: string; mt: number; mb: number }) {
  const theme = useTheme();
  return (
    <Text
      mt={mt}
      mb={mb}
      mx={4}
      fontSize="md"
      color={theme.colors.app.textPrimary}
      alignItems="center"
      justifyItems="center"
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
  const { markReadOnPostImageView } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);
  const { cleanedText, imageLinks } = findImages(post.post.body);
  const body = truncatePost(cleanedText, 100);

  const title = post.post.name;
  let postUrls = [post.post.url];

  const onImagePress = () => {
    if (setPostRead && markReadOnPostImageView) {
      setPostRead();
      lemmyInstance.markPostAsRead({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        read: true,
      });
    }
  };

  const isImagePost = linkInfo.extType === ExtensionType.IMAGE;

  // handle weird posts where someone just posts a markdown image instead of an image post
  const hasMarkdownImages = imageLinks.length > 0;
  const isImageMarkdownPost = !cleanedText && hasMarkdownImages;
  if (hasMarkdownImages) {
    // incase we have an image post with image markdown in the body?
    if (isImagePost) {
      postUrls = [post.post.url, ...imageLinks];
    } else {
      postUrls = imageLinks;
    }
  }

  const renderContent = () => {
    if (isImagePost || isImageMarkdownPost) {
      return (
        <VStack>
          <Title title={title} mt={0} mb={2} />
          <ImagePreview
            images={postUrls}
            postId={post.post.id}
            isNsfw={post.post.nsfw}
            recycled={recycled}
            onImagePress={onImagePress}
          />
        </VStack>
      );
    }

    if (body) {
      return (
        <VStack>
          <Title title={title} mt={0} mb={2} />
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
          <Title title={title} mt={2} mb={2} />
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

  return <Box mb={1}>{renderContent()}</Box>;
}

export default memo(FeedContentPreview);

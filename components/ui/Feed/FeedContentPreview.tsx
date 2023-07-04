import { PostView } from "lemmy-js-client";
import { Box, Text, useTheme } from "native-base";
import React, { useMemo } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import { truncatePost } from "../../../helpers/TextHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import LinkButton from "../buttons/LinkButton";

import { findImages } from "../../../helpers/MarkdownHelper";
import ImagePreview from "../common/ImagePreview";

interface IProps {
  post: PostView;
  recycled?: React.MutableRefObject<{}>;
  setPostRead?: () => void;
}

// TODO Fix the set post read here
function FeedContentPreview({ post, recycled, setPostRead }: IProps) {
  const theme = useTheme();
  const { markReadOnPostImageView } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);
  const { cleanedText, imageLinks } = findImages(post.post.body, true);
  const body = truncatePost(cleanedText, 100);

  const title = post.post.name;
  let postUrls = [post.post.url];

  const isImagePost = linkInfo.extType === ExtensionType.IMAGE;

  // handle weird posts where someone just posts a markdown image instead of an image post
  const isImageMarkdownPost = imageLinks.length > 0;
  if (isImageMarkdownPost) {
    // incase we have an image post with image markdown in the body?
    if (isImagePost) {
      postUrls = [post.post.url, ...imageLinks];
    } else {
      postUrls = imageLinks;
    }
  }

  const showImage = isImagePost || isImageMarkdownPost;
  const showLink =
    linkInfo.extType === ExtensionType.VIDEO ||
    linkInfo.extType === ExtensionType.GENERIC;

  return useMemo(
    () => (
      <Box mb={1}>
        <Text
          mx={4}
          fontSize="md"
          color={theme.colors.app.textPrimary}
          alignItems="center"
          justifyItems="center"
        >
          {title}
        </Text>
        {showImage && (
          <Box mt={2}>
            <ImagePreview
              images={postUrls}
              postId={post.post.id}
              isNsfw={post.post.nsfw}
              recycled={recycled}
            />
          </Box>
        )}
        {!!body && (
          <Text color={theme.colors.app.textSecondary} mx={4} mt={2}>
            {body}
          </Text>
        )}
        {showLink && (
          <Box mx={4} mt={2}>
            <LinkButton
              link={linkInfo.link}
              thumbnail={post.post.thumbnail_url}
            />
          </Box>
        )}
      </Box>
    ),
    [
      post.post.id,
      post.read,
      theme.colors.app.textPrimary,
      theme.colors.app.textSecondary,
    ]
  );
}

export default FeedContentPreview;

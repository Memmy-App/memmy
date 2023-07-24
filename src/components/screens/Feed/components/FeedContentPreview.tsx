import { PostView } from "lemmy-js-client";
import { Box, Text, useTheme } from "native-base";
import React, { useMemo } from "react";
import { useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import { findImages } from "../../../../helpers/MarkdownHelper";
import { truncatePost } from "../../../../helpers/TextHelper";
import MediaPreview from "../../../common/media/MediaPreview";
import LinkButton from "../../../common/Buttons/LinkButton";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies

interface IProps {
  post: PostView;
  recycled?: React.MutableRefObject<{}>;
  setPostRead?: () => void;
}

function FeedContentPreview({ post, recycled, setPostRead }: IProps) {
  const theme = useTheme();
  const { fontWeightPostTitle } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);
  const { cleanedText, imageLinks } = findImages(post.post.body, true);
  const body = truncatePost(cleanedText, 100);

  const title = post.post.name;
  let postUrls = [linkInfo];

  const isImagePost = linkInfo.extType === ExtensionType.IMAGE;
  const isVideoPost = linkInfo.extType === ExtensionType.VIDEO;

  // handle weird posts where someone just posts a markdown image instead of an image Post
  const isImageMarkdownPost = imageLinks.length > 0;
  if (isImageMarkdownPost) {
    // incase we have an image Post with image markdown in the body?
    if (isImagePost) {
      postUrls = [
        ...postUrls,
        ...imageLinks.map((link) => ({ extType: ExtensionType.IMAGE, link })),
      ];
    } else {
      postUrls = imageLinks.map((link) => ({
        extType: ExtensionType.IMAGE,
        link,
      }));
    }
  }

  // handle video posts

  const showMedia = isImagePost || isImageMarkdownPost || isVideoPost;
  const showLink = linkInfo.extType === ExtensionType.GENERIC;

  return useMemo(
    () => (
      <Box mb={1}>
        <Text
          mx={4}
          fontSize="md"
          fontWeight={fontWeightPostTitle}
          color={theme.colors.app.textPrimary}
          alignItems="center"
        >
          {title}
        </Text>
        {showMedia && (
          <Box mt={2}>
            <MediaPreview
              images={postUrls}
              postId={post.post.id}
              isNsfw={post.post.nsfw || post.community.nsfw}
              recycled={recycled}
              setPostRead={setPostRead}
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
      fontWeightPostTitle,
    ]
  );
}

export default FeedContentPreview;

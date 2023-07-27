import { Box, Text } from "@src/components/common/Gluestack";
import React, { useCallback, useMemo } from "react";
import {
  useFeedPostCommunity,
  useFeedPostInfo,
  useFeedPostRead,
} from "@src/stores/feeds/feedsStore";
import { useRoute } from "@react-navigation/core";
import setFeedRead from "@src/stores/feeds/actions/setFeedRead";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import { findImages } from "../../../../helpers/MarkdownHelper";
import { truncatePost } from "../../../../helpers/TextHelper";
import ImagePreview from "../../../common/ImagePreview";
import LinkButton from "../../../common/Buttons/LinkButton";

interface IProps {
  postId: number;
  recycled?: React.MutableRefObject<{}>;
}

function FeedContentPreview({ postId, recycled }: IProps) {
  const { key } = useRoute();

  const theme = useThemeOptions();
  const fontWeightPostTitle = useSettingsStore(
    (state) => state.settings.fontWeightPostTitle
  );

  const postInfo = useFeedPostInfo(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);
  const postRead = useFeedPostRead(key, postId);

  const linkInfo = useMemo(() => getLinkInfo(postInfo.url), [postId]);

  const { cleanedText, imageLinks } = findImages(postInfo.body, true);
  const body = truncatePost(cleanedText, 100);

  let postUrls = [postInfo.url];

  const isImagePost = linkInfo.extType === ExtensionType.IMAGE;

  // handle weird posts where someone just posts a markdown image instead of an image Post
  const isImageMarkdownPost = imageLinks.length > 0;

  if (isImageMarkdownPost) {
    // incase we have an image Post with image markdown in the body?
    if (isImagePost) {
      postUrls = [postInfo.url, ...imageLinks];
    } else {
      postUrls = imageLinks;
    }
  }

  const showImage = isImagePost || isImageMarkdownPost;
  const showLink =
    linkInfo.extType === ExtensionType.VIDEO ||
    linkInfo.extType === ExtensionType.GENERIC;

  const setPostRead = useCallback(() => {
    setFeedRead(key, postId);
  }, [postId, postRead]);

  return (
    <Box mb="$1">
      <Text
        mx="$4"
        size="md"
        fontWeight={fontWeightPostTitle}
        color={theme.colors.textPrimary}
        alignItems="center"
      >
        {postInfo.name}
      </Text>
      {showImage && (
        <Box mt="$2">
          <ImagePreview
            images={postUrls}
            postId={postId}
            isNsfw={postInfo.nsfw || postCommunity.nsfw}
            recycled={recycled}
            setPostRead={setPostRead}
          />
        </Box>
      )}
      {!!body && (
        <Text color={theme.colors.textSecondary} mx="$4" mt="$2">
          {body}
        </Text>
      )}
      {showLink && (
        <Box mx="$4" mt="$2">
          <LinkButton link={linkInfo.link} thumbnail={postInfo.thumbnail_url} />
        </Box>
      )}
    </Box>
  );
}

export default React.memo(FeedContentPreview);

import React, { useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import {
  useFeedPostCommunity,
  useFeedPostInfo,
  useFeedPostRead,
} from "@src/state/feed/feedStore";
import { ExtensionType, getLinkInfo } from "@src/helpers/links";
import { findImages } from "@src/helpers/markdown";
import removeMd from "remove-markdown";
import { Box, Text } from "@src/components/gluestack";
import LinkButton from "@src/components/common/Button/LinkButton";
import ImagePreview from "@src/components/common/ImageViewer/ImagePreview";

interface IProps {
  postId: number;
  recycled: React.MutableRefObject<{}>;
}

function ItemContent({ postId, recycled }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const theme = useThemeOptions();

  const fontWeightPostTitle = useSettingsStore(
    (state) => state.fontWeightPostTitle
  );

  const postInfo = useFeedPostInfo(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);
  const postRead = useFeedPostRead(key, postId);

  const linkInfo = useMemo(() => getLinkInfo(postInfo?.url), [postId]);

  const { cleanedText, imageLinks } = useMemo(
    () => findImages(postInfo?.body, true),
    [postId]
  );

  let postUrls = [postInfo?.url];

  const isImagePost = useMemo(
    () => linkInfo.extType === ExtensionType.IMAGE,
    [postId]
  );

  const isImageMarkdownPost = useMemo(() => imageLinks.length > 0, [postId]);

  if (isImageMarkdownPost) {
    if (isImagePost && postInfo?.url) {
      postUrls = [postInfo.url, ...imageLinks];
    } else {
      postUrls = imageLinks;
    }
  }

  const showLink = useMemo(
    () => ExtensionType.VIDEO || ExtensionType.GENERIC,
    [postId]
  );

  const postTitle = useMemo(() => removeMd(postInfo?.name), [postId]);
  const postBody = useMemo(() => removeMd(postInfo?.body), [postId]);

  return (
    <Box mb="$1">
      <Text
        mx="$4"
        size="md"
        fontWeight={fontWeightPostTitle}
        color={theme.colors.textPrimary}
        alignItems="center"
      >
        {postTitle}
      </Text>
      {(isImagePost || isImageMarkdownPost) && (
        <Box mt="$2">
          <ImagePreview
            images={postUrls}
            postId={postId}
            isNsfw={!!(postInfo?.nsfw || postCommunity?.nsfw)}
            recycled={recycled}
          />
        </Box>
      )}
      {!!postInfo?.body && (
        <Text
          color={theme.colors.textSecondary}
          mx="$4"
          mt="$1"
          numberOfLines={2}
          size="sm"
        >
          {postBody}
        </Text>
      )}
      {showLink && (
        <Box mx="$4" mt="$2">
          <LinkButton
            link={linkInfo.link ?? ""}
            thumbnail={postInfo?.thumbnail_url}
          />
        </Box>
      )}
    </Box>
  );
}

export const FeedItemContent = React.memo(ItemContent);

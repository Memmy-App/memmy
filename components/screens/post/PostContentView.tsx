import { PostView } from "lemmy-js-client";
import { Box, Pressable, Text, VStack, useTheme } from "native-base";
import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../store";
import LinkButton from "../../ui/buttons/LinkButton";
import ImageModal from "../../ui/image/ImageModal";
import MemoizedFastImage from "../../ui/image/MemoizedFastImage";
import RenderMarkdown from "../../ui/markdown/RenderMarkdown";

import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";

function Title({ title, mt, mb }: { title: string; mt: number; mb: number }) {
  const theme = useTheme();
  return (
    <Text
      mt={mt}
      mb={mb}
      mx={4}
      fontSize="lg"
      color={theme.colors.app.textPrimary}
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

function PostContentView({ post, recycled, setPostRead }: IProps) {
  const theme = useTheme();
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);

  const { body } = post.post;
  const title = post.post.name;
  const [imageViewOpen, setImageViewOpen] = useState(false);

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

  const isImage = linkInfo.extType === ExtensionType.IMAGE;

  const renderContent = () => {
    if (isImage) {
      return (
        <VStack>
          <Pressable
            onPress={onImagePress}
            onLongPress={onImageLongPress}
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.colors.app.bg}
          >
            <MemoizedFastImage
              postId={post.post.id}
              source={post.post.url}
              recycled={recycled}
              nsfw={post.post.nsfw && blurNsfw}
            />
          </Pressable>

          <Title title={title} mt={2} mb={0} />
          {body && (
            <Box mx={4}>
              <RenderMarkdown text={body} addImages truncate={false} />
            </Box>
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
        </VStack>
      );
    }

    if (body) {
      return (
        <VStack>
          <>
            <Title title={title} mt={2} mb={0} />
            <Box mx={4}>
              <RenderMarkdown text={body} addImages truncate={false} />
            </Box>
          </>
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

  return useMemo(
    () => <Box mb={1}>{renderContent()}</Box>,
    [post.post.id, post.read, imageViewOpen]
  );
}

export default PostContentView;

import React, { useMemo, useState } from "react";
import { PostView } from "lemmy-js-client";
import {
  Container,
  Pressable,
  Text,
  useTheme,
  VStack,
  View,
} from "native-base";
import { Dimensions, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../helpers/LinkHelper";
import { truncatePost } from "../../helpers/TextHelper";
import LinkButton from "./buttons/LinkButton";
import RenderMarkdown from "./markdown/RenderMarkdown";
import { useAppSelector } from "../../store";
import { selectSettings } from "../../slices/settings/settingsSlice";
import ImageModal from "./image/ImageModal";
import MemoizedFastImage from "./image/MemoizedFastImage";

interface ContentViewProps {
  post: PostView;
  recycled?: React.MutableRefObject<{}>;
  isPreview?: boolean;
}

function ContentView({ post, isPreview = false, recycled }: ContentViewProps) {
  const theme = useTheme();
  const { blurNsfw } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);

  const body = isPreview ? truncatePost(post.post.body, 100) : post.post.body;
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  return useMemo(
    () => (
      <>
        {linkInfo.extType === ExtensionType.IMAGE && (
          <VStack mb={3}>
            {post.post.nsfw && blurNsfw ? (
              <Pressable onPress={onImagePress} onLongPress={onImageLongPress}>
                <MemoizedFastImage
                  postId={post.post.id}
                  source={post.post.url}
                  recycled={recycled}
                  nsfw
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={onImagePress}
                onLongPress={onImageLongPress}
                alignItems="center"
                justifyContent="center"
              >
                <MemoizedFastImage
                  postId={post.post.id}
                  source={post.post.url}
                  recycled={recycled}
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
          </VStack>
        )}

        {!isPreview && (
          <Text
            fontSize="lg"
            mt={3}
            mx={4}
            mb={1}
            color={theme.colors.app.textPrimary}
          >
            {post.post.name}
          </Text>
        )}

        {linkInfo.extType === ExtensionType.NONE && (
          <VStack px={4}>
            {isPreview ? (
              <Text color={theme.colors.app.textSecondary}>{body}</Text>
            ) : (
              <RenderMarkdown
                text={body}
                addImages={!isPreview}
                truncate={false}
              />
            )}
          </VStack>
        )}
        {linkInfo.extType === ExtensionType.VIDEO ||
          // eslint-disable-next-line prettier/prettier
          linkInfo.extType === ExtensionType.GENERIC && (
            <LinkButton
              link={linkInfo.link}
              thumbnail={post.post.thumbnail_url}
            />
            // eslint-disable-next-line prettier/prettier
          )}
      </>
    ),
    [post.post.id, imageViewOpen]
  );
}

export default ContentView;

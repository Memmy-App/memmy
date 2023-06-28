import { PostView } from "lemmy-js-client";
import { Pressable, Text, VStack, useTheme } from "native-base";
import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../helpers/LinkHelper";
import { truncatePost } from "../../helpers/TextHelper";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { useAppSelector } from "../../store";
import LinkButton from "./buttons/LinkButton";
import ImageModal from "./image/ImageModal";
import MemoizedFastImage from "./image/MemoizedFastImage";
import RenderMarkdown from "./markdown/RenderMarkdown";

function Content({
  postTitle,
  isRead,
  isPreview,
  children,
  isImage,
}: {
  postTitle: string;
  isRead: boolean;
  isPreview: boolean;
  children: JSX.Element;
  isImage?: boolean;
}) {
  const theme = useTheme();

  const title = (
    <Text
      fontSize={isPreview ? "md" : "lg"}
      color={
        isRead && isPreview
          ? theme.colors.app.textSecondary
          : theme.colors.app.textPrimary
      }
    >
      {postTitle}
    </Text>
  );

  if (isImage && !isPreview) {
    return (
      <VStack space={1}>
        {children}
        {title}
      </VStack>
    );
  }

  return (
    <VStack space={2}>
      {title}
      {children}
    </VStack>
  );
}

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

  const isImage = linkInfo.extType === ExtensionType.IMAGE;

  const renderContent = () => {
    if (isImage) {
      return (
        <>
          <Content
            postTitle={post.post.name}
            isPreview={isPreview}
            isRead={post.read}
            isImage
          >
            <>
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
                  nsfw={post.post.nsfw && blurNsfw}
                />
              </Pressable>
              <ImageModal
                source={post.post.url}
                width={Dimensions.get("screen").width}
                height={Dimensions.get("screen").height}
                isOpen={imageViewOpen}
                onRequestClose={() => {
                  setImageViewOpen(false);
                }}
              />
            </>
          </Content>
        </>
      );
    }

    if (linkInfo.extType === ExtensionType.NONE) {
      return (
        <>
          <Content
            postTitle={post.post.name}
            isPreview={isPreview}
            isRead={post.read}
          >
            {isPreview ? (
              <Text color={theme.colors.app.textSecondary}>{body}</Text>
            ) : (
              <RenderMarkdown
                text={body}
                addImages={!isPreview}
                truncate={false}
              />
            )}
          </Content>
        </>
      );
    }

    if (
      linkInfo.extType === ExtensionType.VIDEO ||
      linkInfo.extType === ExtensionType.GENERIC
    ) {
      return (
        <Content
          postTitle={post.post.name}
          isPreview={isPreview}
          isRead={post.read}
        >
          <LinkButton
            link={linkInfo.link}
            thumbnail={post.post.thumbnail_url}
          />
        </Content>
      );
    }

    return null;
  };

  return useMemo(
    () => (
      <VStack mt={isPreview || isImage ? 0 : 3} mx={4} mb={1}>
        {renderContent()}
      </VStack>
    ),
    [post.post.id, imageViewOpen]
  );
}

export default ContentView;

import { PostView } from "lemmy-js-client";
import { Box, Pressable, Text, VStack, useTheme } from "native-base";
import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ExtensionType,
  LinkInfo,
  getLinkInfo,
  openLink,
} from "../../helpers/LinkHelper";
import { truncatePost } from "../../helpers/TextHelper";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { useAppSelector } from "../../store";
import ImageModal from "./image/ImageModal";
import MemoizedFastImage from "./image/MemoizedFastImage";
import RenderMarkdown from "./markdown/RenderMarkdown";

import { lemmyAuthToken, lemmyInstance } from "../../lemmy/LemmyInstance";

function LinkPreviewContainer({ linkInfo }: { linkInfo: LinkInfo }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  return (
    <LinkPreview
      text={linkInfo.link}
      containerStyle={{
        backgroundColor: theme.colors.app.bg,
      }}
      renderText={() => false}
      renderTitle={(linkTitle: string) => (
        <Text color={theme.colors.app.textPrimary}>{linkTitle}</Text>
      )}
      renderDescription={(linkDescription: string) => (
        <Text color={theme.colors.app.textSecondary}>{linkDescription}</Text>
      )}
      touchableWithoutFeedbackProps={{
        onPress: () => {
          openLink(linkInfo.link, navigation);
        },
      }}
    />
  );
}

function Title({
  title,
  mt,
  mb,
  isPreview,
  isRead,
}: {
  title: string;
  mt: number;
  mb: number;
  isPreview?: boolean;
  isRead?: boolean;
}) {
  const theme = useTheme();
  return (
    <Text
      mt={mt}
      mb={mb}
      fontSize={isPreview ? "md" : "lg"}
      color={
        isRead && isPreview
          ? theme.colors.app.textSecondary
          : theme.colors.app.textPrimary
      }
    >
      {title}
    </Text>
  );
}

interface ContentViewProps {
  post: PostView;
  recycled?: React.MutableRefObject<{}>;
  isPreview?: boolean;
  setPostRead?: () => void;
}

function ContentView({
  post,
  isPreview = false,
  recycled,
  setPostRead,
}: ContentViewProps) {
  const theme = useTheme();
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);

  const linkInfo = getLinkInfo(post.post.url);

  const body = isPreview ? truncatePost(post.post.body, 100) : post.post.body;
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
  const isRead = post.read;

  const renderContent = () => {
    if (isImage) {
      return (
        <VStack>
          {isPreview && (
            <Title
              title={title}
              mt={0}
              mb={2}
              isPreview={isPreview}
              isRead={isRead}
            />
          )}
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
          {!isPreview && body && (
            <Title
              title={title}
              mt={2}
              mb={0}
              isPreview={isPreview}
              isRead={isRead}
            />
          )}
          {body && (
            <RenderMarkdown
              text={body}
              addImages={!isPreview}
              truncate={false}
            />
          )}
          {!isPreview && !body && (
            <Title
              title={title}
              mt={2}
              mb={0}
              isPreview={isPreview}
              isRead={isRead}
            />
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

    if (linkInfo.extType === ExtensionType.NONE) {
      return (
        <VStack>
          {isPreview ? (
            <>
              <Title
                title={title}
                mt={0}
                mb={2}
                isPreview={isPreview}
                isRead={isRead}
              />
              <Text color={theme.colors.app.textSecondary}>{body}</Text>
            </>
          ) : (
            <>
              <Title
                title={title}
                mt={2}
                mb={0}
                isPreview={isPreview}
                isRead={isRead}
              />
              <RenderMarkdown
                text={body}
                addImages={!isPreview}
                truncate={false}
              />
            </>
          )}
        </VStack>
      );
    }

    if (
      linkInfo.extType === ExtensionType.VIDEO ||
      linkInfo.extType === ExtensionType.GENERIC
    ) {
      return (
        <VStack>
          <Title
            title={title}
            mt={2}
            mb={2}
            isPreview={isPreview}
            isRead={isRead}
          />
          <LinkPreviewContainer linkInfo={linkInfo} />
        </VStack>
      );
    }

    return null;
  };

  return useMemo(
    () => (
      <Box mx={4} mb={1}>
        {renderContent()}
      </Box>
    ),
    [post.post.id, post.read, imageViewOpen]
  );
}

export default ContentView;

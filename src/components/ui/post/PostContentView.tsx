import { PostView } from "lemmy-js-client";
import { Box, Text, useTheme, VStack } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import LinkButton from "../buttons/LinkButton";
import RenderMarkdown from "../markdown/RenderMarkdown";
import ImageViewer from "../image/ImageViewer";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";

function Title({ title, mt, mb }: { title: string; mt: number; mb: number }) {
  const theme = useTheme();
  const { fontWeightPostTitle } = useAppSelector(selectSettings);
  return (
    <Text
      mt={mt}
      mb={mb}
      mx={4}
      fontSize="lg"
      fontWeight={fontWeightPostTitle}
      color={theme.colors.app.textPrimary}
    >
      {title}
    </Text>
  );
}

interface IProps {
  post: PostView;
}

function PostContentView({ post }: IProps) {
  const linkInfo = getLinkInfo(post.post.url);

  const { body } = post.post;
  const title = post.post.name;

  const isImage = linkInfo.extType === ExtensionType.IMAGE;

  const linkInfoBlock = () => {
    if (
      linkInfo.extType === ExtensionType.VIDEO ||
      linkInfo.extType === ExtensionType.GENERIC
    ) {
      return (
        <VStack>
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

  const renderContent = () => {
    if (isImage) {
      return (
        <VStack>
          <ImageViewer
            source={post.post.url}
            nsfw={post.post.nsfw || post.community.nsfw}
            id={post.post.id}
          />
          <Title title={title} mt={2} mb={0} />
          {body && (
            <Box mx={4}>
              <RenderMarkdown text={body} addImages truncate={false} />
            </Box>
          )}
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
            {linkInfoBlock()}
          </>
        </VStack>
      );
    }

    return (
      <VStack>
        <Title title={title} mt={2} mb={2} />
        {linkInfoBlock()}
      </VStack>
    );
  };

  return <Box mb={1}>{renderContent()}</Box>;
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.post.post.id === next.post.post.id;

export default React.memo(PostContentView, areEqual);

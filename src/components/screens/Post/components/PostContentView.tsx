import { PostView } from "lemmy-js-client";
import { Box, VStack } from "native-base";
import React from "react";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import LinkButton from "../../../common/Buttons/LinkButton";
import ImageViewer from "../../../common/ImageViewer/ImageViewer";
import RenderMarkdown from "../../../common/Markdown/RenderMarkdown";
import PostTitle from "./PostTitle";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies

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
          <PostTitle title={title} mt={2} mb={0} />
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
            <PostTitle title={title} mt={2} mb={0} />
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
        <PostTitle title={title} mt={2} mb={2} />
        {linkInfoBlock()}
      </VStack>
    );
  };

  return <Box mb={1}>{renderContent()}</Box>;
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.post.post.id === next.post.post.id;

export default React.memo(PostContentView, areEqual);

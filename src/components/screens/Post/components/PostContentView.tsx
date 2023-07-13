import { PostView } from "lemmy-js-client";
import { Box } from "native-base";
import React from "react";
import {
  ExtensionType,
  getBaseUrl,
  getLinkInfo,
} from "../../../../helpers/LinkHelper";
import LinkButton from "../../../common/Buttons/LinkButton";
import ImageViewer from "../../../common/ImageViewer/ImageViewer";
import RenderMarkdown from "../../../common/Markdown/RenderMarkdown";
import PostTitle from "./PostTitle";

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
        <Box mx={4}>
          <LinkButton
            link={linkInfo.link}
            thumbnail={post.post.thumbnail_url}
          />
        </Box>
      );
    }

    return null;
  };

  return (
    <Box mb={1}>
      {isImage && (
        <ImageViewer
          sources={[post.post.url]}
          nsfw={post.post.nsfw || post.community.nsfw}
          id={post.post.id}
        />
      )}

      <PostTitle title={title} mt={2} mb={isImage ? 1 : 0} />

      {!!body && (
        <Box mx={4}>
          <RenderMarkdown text={body} instance={getBaseUrl(post.post.ap_id)} />
        </Box>
      )}

      {linkInfoBlock()}
    </Box>
  );
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.post.post.id === next.post.post.id;

export default React.memo(PostContentView, areEqual);

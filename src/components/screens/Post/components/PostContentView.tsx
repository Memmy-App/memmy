import { Box } from "native-base";
import React, { useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import {
  ExtensionType,
  getBaseUrl,
  getLinkInfo,
} from "../../../../helpers/LinkHelper";
import LinkButton from "../../../common/Buttons/LinkButton";
import ImageViewer from "../../../common/ImageViewer/ImageViewer";
import RenderMarkdown from "../../../common/Markdown/RenderMarkdown";
import PostTitle from "./PostTitle";
import { useCurrentPost } from "../../../../stores/posts/postsStore";

function PostContentView() {
  const currentPost = useCurrentPost(useRoute<any>().params.postKey);

  const linkInfo = useMemo(
    () => getLinkInfo(currentPost.post.url),
    [currentPost.post.id]
  );

  const { body } = currentPost.post;

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
            thumbnail={currentPost.post.thumbnail_url}
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
          source={currentPost.post.url}
          nsfw={currentPost.post.nsfw || currentPost.community.nsfw}
          postId={currentPost.post.id}
        />
      )}

      <PostTitle mt={2} mb={isImage ? 1 : 0} />

      {!!body && (
        <Box mx={4}>
          <RenderMarkdown
            text={body}
            instance={getBaseUrl(currentPost.post.ap_id)}
          />
        </Box>
      )}

      {linkInfoBlock()}
    </Box>
  );
}

export default React.memo(PostContentView);

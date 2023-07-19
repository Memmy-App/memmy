import { Box } from "native-base";
import React, { useMemo } from "react";
import {
  ExtensionType,
  getBaseUrl,
  getLinkInfo,
} from "../../../../helpers/LinkHelper";
import LinkButton from "../../../common/Buttons/LinkButton";
import ImageViewer from "../../../common/ImageViewer/ImageViewer";
import RenderMarkdown from "../../../common/Markdown/RenderMarkdown";
import PostTitle from "./PostTitle";
import usePost from "../../../../hooks/post/usePost";

function PostContentView() {
  const postHook = usePost();

  const linkInfo = useMemo(
    () => getLinkInfo(postHook.post.post.url),
    [postHook.post.post.id]
  );

  const { body } = postHook.post.post;

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
            thumbnail={postHook.post.post.thumbnail_url}
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
          source={postHook.post.post.url}
          nsfw={postHook.post.post.nsfw || postHook.post.community.nsfw}
          postId={postHook.post.post.id}
        />
      )}

      <PostTitle mt={2} mb={isImage ? 1 : 0} />

      {!!body && (
        <Box mx={4}>
          <RenderMarkdown
            text={body}
            instance={getBaseUrl(postHook.post.post.ap_id)}
          />
        </Box>
      )}

      {linkInfoBlock()}
    </Box>
  );
}

export default React.memo(PostContentView);

import { Box } from "native-base";
import React from "react";
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
  const { postKey } = useRoute<any>().params;
  const postState = useCurrentPost(postKey);

  const linkInfo = getLinkInfo(postState.post.post.url);

  const { body, name: title } = postState.post.post;

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
            thumbnail={postState.post.post.thumbnail_url}
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
          source={{ uri: postState.post.post.url }}
          nsfw={postState.post.post.nsfw || postState.post.community.nsfw}
          postId={postState.post.post.id}
        />
      )}

      <PostTitle title={title} mt={2} mb={isImage ? 1 : 0} />

      {!!body && (
        <Box mx={4}>
          <RenderMarkdown
            text={body}
            instance={getBaseUrl(postState.post.post.ap_id)}
          />
        </Box>
      )}

      {linkInfoBlock()}
    </Box>
  );
}

export default React.memo(PostContentView);

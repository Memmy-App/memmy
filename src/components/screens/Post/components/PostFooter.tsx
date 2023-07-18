import React from "react";
import { Center, Spinner, Text, useTheme } from "native-base";
import { useRoute } from "@react-navigation/core";
import { UsePost } from "../../../../hooks/post/usePost";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";
import NoResultView from "../../../common/NoResultView";
import { useCurrentPost } from "../../../../stores/posts/postsStore";
import { loadPostComments } from "../../../../stores/posts/actions";

function PostFooter() {
  const { postKey } = useRoute<any>().params;
  const postState = useCurrentPost(postKey);

  const theme = useTheme();

  if (postState.commentsLoading) {
    return (
      <Center my={4}>
        <Spinner />
        <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
          Loading comments...
        </Text>
      </Center>
    );
  }

  if (postState.commentsError) {
    return (
      <LoadingErrorFooter
        onRetryPress={() => loadPostComments(postKey, {})}
        message="Error loading comments."
      />
    );
  }

  if (postState.comments.length < 1) {
    return <NoResultView my={4} type="comments" />;
  }

  return null;
}

export default PostFooter;

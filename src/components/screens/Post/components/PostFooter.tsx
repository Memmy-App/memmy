import React from "react";
import { Center, Spinner, Text, useTheme } from "native-base";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";
import NoResultView from "../../../common/NoResultView";
import { loadPostComments } from "../../../../stores/posts/actions";
import usePost from "../../../../hooks/post/usePost";

function PostFooter() {
  const postHook = usePost();

  const theme = useTheme();

  if (postHook.postState.commentsLoading) {
    return (
      <Center my={4}>
        <Spinner />
        <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
          Loading comments...
        </Text>
      </Center>
    );
  }

  if (postHook.postState.commentsError) {
    return (
      <LoadingErrorFooter
        onRetryPress={() => loadPostComments(postHook.postKey, {})}
        message="Error loading comments."
      />
    );
  }

  if (postHook.postState.comments.length < 1) {
    return <NoResultView my={4} type="comments" />;
  }

  return null;
}

export default PostFooter;

import React from "react";
import { Center, Spinner, Text } from "@src/components/common/Gluestack";
import { useRoute } from "@react-navigation/core";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";
import NoResultView from "../../../common/NoResultView";
import loadPostComments from "../../../../stores/posts/actions/loadPostComments";
import {
  usePostComments,
  usePostCommentsStatus,
} from "../../../../stores/posts/postsStore";

function PostFooter() {
  const { postKey } = useRoute<any>().params;
  const commentsStatus = usePostCommentsStatus(postKey);
  const comments = usePostComments(postKey);

  const theme = useThemeOptions();

  if (commentsStatus.commentsLoading) {
    return (
      <Center my="$4">
        <Spinner />
        <Text fontStyle="italic" color={theme.colors.textSecondary}>
          Loading comments...
        </Text>
      </Center>
    );
  }

  if (commentsStatus.commentsError) {
    return (
      <LoadingErrorFooter
        onRetryPress={() => loadPostComments(postKey, {})}
        message="Error loading comments."
      />
    );
  }

  if (comments.length < 1) {
    return <NoResultView my="$4" type="comments" />;
  }

  return null;
}

export default PostFooter;

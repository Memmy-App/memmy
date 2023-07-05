import React from "react";
import { Center, Spinner, Text, useTheme } from "native-base";
import LoadingErrorFooter from "../Loading/LoadingErrorFooter";
import NoResultView from "../common/NoResultView";
import { UsePost } from "../../hooks/post/postHooks";

interface IProps {
  post: UsePost;
}

function PostFooter({ post }: IProps) {
  const theme = useTheme();

  if (post.commentsLoading) {
    return (
      <Center my={4}>
        <Spinner />
        <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
          Loading comments...
        </Text>
      </Center>
    );
  }

  if (post.commentsError) {
    return (
      <LoadingErrorFooter
        onRetryPress={post.doLoad}
        message="Error loading comments."
      />
    );
  }

  if (post.comments.length < 1) {
    return <NoResultView my={4} type="comments" />;
  }

  return null;
}

export default PostFooter;

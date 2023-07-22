import { HStack, useTheme } from "native-base";
import React, { useMemo } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import IconButtonWithText from "../../../common/IconButtonWithText";
import VoteButton from "../../../common/Vote/VoteButton";
import SFIcon from "../../../common/icons/SFIcon";
import usePostActionBar from "../../../../hooks/post/usePostActionBar";

function PostActionBar() {
  const postActionBar = usePostActionBar();

  const { colors } = useTheme();

  const bubbleIcon = useMemo(
    () => (
      <SFIcon
        icon="bubble.left"
        color={postActionBar.currentPost.saved && colors.app.bookmarkText}
      />
    ),
    []
  );

  const shareIcon = useMemo(
    () => (
      <SFIcon
        icon="square.and.arrow.up"
        color={postActionBar.currentPost.saved && colors.app.bookmarkText}
      />
    ),
    []
  );

  const bookmarkIcon = useMemo(
    () => (
      <SFIcon
        icon="bookmark"
        color={postActionBar.currentPost.saved && colors.app.bookmarkText}
      />
    ),
    [postActionBar.currentPost.saved]
  );

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <HStack
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      mx={4}
      py={1}
    >
      <VoteButton
        onPressHandler={postActionBar.onUpvotePress}
        type="upvote"
        isVoted={postActionBar.currentPost?.my_vote === 1}
        text={postActionBar.currentPost.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={postActionBar.onDownvotePress}
        type="downvote"
        isVoted={postActionBar.currentPost?.my_vote === -1}
        text={postActionBar.currentPost.counts.downvotes}
        isAccented
      />

      <IconButtonWithText
        onPressHandler={postActionBar.onSavePress}
        icon={bookmarkIcon}
        iconBgColor={
          postActionBar.currentPost.saved ? colors.app.bookmark : "transparent"
        }
      />

      <IconButtonWithText
        onPressHandler={postActionBar.onCommentPress}
        icon={bubbleIcon}
      />

      <IconButtonWithText
        icon={shareIcon}
        onPressHandler={postActionBar.onSharePress}
      />
    </HStack>
  );
}

export default React.memo(PostActionBar);

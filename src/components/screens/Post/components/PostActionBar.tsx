import { HStack, useTheme } from "native-base";
import React, { useCallback, useEffect, useMemo } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch } from "../../../../../store";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { shareLink } from "../../../../helpers/ShareHelper";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import IconButtonWithText from "../../../common/IconButtonWithText";
import VoteButton from "../../../common/Vote/VoteButton";
import SFIcon from "../../../common/icons/SFIcon";
import usePost from "../../../../hooks/post/usePost";
import { useCurrentPost } from "../../../../stores/posts/postsStore";

function PostActionBar() {
  const postHook = usePost();
  const currentPost = useCurrentPost(useRoute<any>().params.postKey);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("blah");
  }, [currentPost]);

  const onCommentPress = useCallback(() => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: currentPost,
        languageId: currentPost.post.language_id,
      })
    );

    navigation.push("NewComment");
  }, [currentPost.post.id]);

  const onSharePress = useCallback(() => {
    onGenericHapticFeedback();

    shareLink({
      link: currentPost.post.ap_id,
      title: currentPost.post.name,
    }).then();
  }, [currentPost.post.id]);

  const onUpvotePress = useCallback(() => {
    postHook.doVote(1);
  }, [currentPost.post.id, currentPost.my_vote]);

  const onDownvotePress = useCallback(() => {
    postHook.doVote(-1);
  }, [currentPost.post.id, currentPost.my_vote]);

  const bookmarkIcon = useMemo(
    () => (
      <SFIcon
        icon="bookmark"
        color={currentPost.saved && colors.app.bookmarkText}
      />
    ),
    [currentPost.saved]
  );

  const bubbleIcon = useMemo(
    () => (
      <SFIcon
        icon="bubble.left"
        color={currentPost.saved && colors.app.bookmarkText}
      />
    ),
    []
  );

  const shareIcon = useMemo(
    () => (
      <SFIcon
        icon="square.and.arrow.up"
        color={currentPost.saved && colors.app.bookmarkText}
      />
    ),
    []
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
        onPressHandler={onUpvotePress}
        type="upvote"
        isVoted={currentPost?.my_vote === 1}
        text={currentPost.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={onDownvotePress}
        type="downvote"
        isVoted={currentPost?.my_vote === -1}
        text={currentPost.counts.downvotes}
        isAccented
      />

      <IconButtonWithText
        onPressHandler={postHook.doSave}
        icon={bookmarkIcon}
        iconBgColor={currentPost.saved ? colors.app.bookmark : "transparent"}
      />

      <IconButtonWithText onPressHandler={onCommentPress} icon={bubbleIcon} />

      <IconButtonWithText icon={shareIcon} onPressHandler={onSharePress} />
    </HStack>
  );
}

export default React.memo(PostActionBar);

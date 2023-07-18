import { HStack, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch } from "../../../../../store";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { shareLink } from "../../../../helpers/ShareHelper";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import IconButtonWithText from "../../../common/IconButtonWithText";
import VoteButton from "../../../common/Vote/VoteButton";
import SFIcon from "../../../common/icons/SFIcon";
import usePost from "../../../../hooks/post/usePost";

function PostActionBar() {
  const postHook = usePost();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: postHook.post,
        languageId: postHook.post.post.language_id,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    onGenericHapticFeedback();

    shareLink({
      link: postHook.post.post.ap_id,
      title: postHook.post.post.name,
    }).then();
  };

  const onUpvotePress = () => {
    postHook.doVote(1);
  };

  const onDownvotePress = () => {
    postHook.doVote(-1);
  };

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
        isVoted={postHook.post?.my_vote === 1}
        text={postHook.post.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={onDownvotePress}
        type="downvote"
        isVoted={postHook.post?.my_vote === -1}
        text={postHook.post.counts.downvotes}
        isAccented
      />

      <IconButtonWithText
        onPressHandler={() => {}}
        icon={
          <SFIcon
            icon="bookmark"
            color={postHook.post.saved && colors.app.bookmarkText}
          />
        }
        iconBgColor={postHook.post.saved ? colors.app.bookmark : "transparent"}
      />

      <IconButtonWithText
        onPressHandler={onCommentPress}
        icon={<SFIcon icon="bubble.left" />}
      />

      <IconButtonWithText
        icon={<SFIcon icon="square.and.arrow.up" />}
        onPressHandler={onSharePress}
      />
    </HStack>
  );
}

export default React.memo(PostActionBar);

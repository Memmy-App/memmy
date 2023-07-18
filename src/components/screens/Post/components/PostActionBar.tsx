import { HStack, useTheme } from "native-base";
import React from "react";
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
import { useCurrentPost } from "../../../../stores/posts/postsStore";

function PostActionBar() {
  const { postKey } = useRoute<any>().params;
  const postState = useCurrentPost(postKey);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: postState.post,
        languageId: postState.post.post.language_id,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    onGenericHapticFeedback();

    shareLink({
      link: postState.post.post.ap_id,
      title: postState.post.post.name,
    });
  };

  const onUpvotePress = () => {
    // doVote(1).then();
  };

  const onDownvotePress = () => {
    // doVote(-1).then();
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
        isVoted={postState.post?.my_vote === 1}
        text={postState.post.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={onDownvotePress}
        type="downvote"
        isVoted={postState.post?.my_vote === -1}
        text={postState.post.counts.downvotes}
        isAccented
      />

      <IconButtonWithText
        onPressHandler={() => {}}
        icon={
          <SFIcon
            icon="bookmark"
            color={postState.post.saved && colors.app.bookmarkText}
          />
        }
        iconBgColor={postState.post.saved ? colors.app.bookmark : "transparent"}
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

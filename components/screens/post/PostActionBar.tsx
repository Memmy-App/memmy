import { HStack, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBookmark,
  IconMessageCirclePlus,
  IconShare2,
  IconArrowsSort,
} from "tabler-icons-react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { CommentSortType } from "lemmy-js-client";
import { shareLink } from "../../../helpers/ShareHelper";
import { setResponseTo } from "../../../slices/comments/newCommentSlice";
import { useAppDispatch } from "../../../store";
import { UsePost } from "../../hooks/post/postHooks";
import IconButtonWithText from "../../ui/common/IconButtonWithText";
import VoteButton from "../../ui/common/VoteButton";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";

const commentSortOptions: CommentSortType[] = ["Top", "Hot", "New", "Old"];

function PostActionBar({ post }: { post: UsePost }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, config } = useTheme();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const onVotePress = (value: -1 | 0 | 1) => {
    post.doVote(value);
  };

  const onCommentPress = () => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: post.currentPost,
        languageId: post.currentPost.post.language_id,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    onGenericHapticFeedback();

    shareLink({
      link: post.currentPost.post.ap_id,
      title: post.currentPost.post.name,
    });
  };

  const onSortPress = () => {
    const cancelButtonIndex = 4;
    showActionSheetWithOptions(
      {
        options: [
          ...commentSortOptions.map((sortType) =>
            sortType === post.commentsSort ? `${sortType} (current)` : sortType
          ),
          "Cancel",
        ],
        cancelButtonIndex,
        userInterfaceStyle: config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;
        if (commentSortOptions[index] === post.commentsSort) return;
        post.setCommentsSort(commentSortOptions[index]);
      }
    );
  };

  const isUpvoted = post.currentPost?.my_vote === 1;
  const isDownvoted = post.currentPost?.my_vote === -1;

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <HStack
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      mx={4}
      py={1}
    >
      <HStack space={3}>
        <VoteButton
          onPressHandler={() => onVotePress(1)}
          type="upvote"
          isVoted={isUpvoted}
          text={
            post.currentPost.my_vote === 1
              ? post.currentPost.counts.upvotes + 1
              : post.currentPost.counts.upvotes
          }
          isAccented
        />
        <VoteButton
          onPressHandler={() => onVotePress(-1)}
          type="downvote"
          isVoted={isDownvoted}
          text={
            post.currentPost.my_vote === -1
              ? post.currentPost.counts.downvotes + 1
              : post.currentPost.counts.downvotes
          }
          isAccented
        />
      </HStack>

      <HStack space={3}>
        <IconButtonWithText
          icon={<IconArrowsSort color={colors.app.accent} size={25} />}
          onPressHandler={onSortPress}
        />
        <IconButtonWithText
          onPressHandler={post.doSave}
          icon={
            <IconBookmark
              size={25}
              color={
                post.currentPost.saved
                  ? colors.app.bookmarkText
                  : colors.app.accent
              }
            />
          }
          iconBgColor={
            post.currentPost.saved ? colors.app.bookmark : "transparent"
          }
        />
        <IconButtonWithText
          onPressHandler={onCommentPress}
          icon={<IconMessageCirclePlus color={colors.app.accent} size={25} />}
        />
        <IconButtonWithText
          icon={<IconShare2 size={25} color={colors.app.accent} />}
          onPressHandler={onSharePress}
        />
      </HStack>
    </HStack>
  );
}

export default PostActionBar;

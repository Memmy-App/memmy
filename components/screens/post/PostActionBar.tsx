import { HStack, IconButton, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBookmark,
  IconMessageCirclePlus,
  IconShare2,
} from "tabler-icons-react-native";
import { shareLink } from "../../../helpers/ShareHelper";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { useAppDispatch } from "../../../store";
import { UsePost } from "../../hooks/post/postHooks";
import IconButtonWithText from "../../ui/common/IconButtonWithText";
import VoteButton from "../../ui/common/VoteButton";

function PostActionBar({ post }: { post: UsePost }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const onVotePress = (value: -1 | 0 | 1) => {
    post.doVote(value);
  };

  const onCommentPress = () => {
    dispatch(
      setResponseTo({
        post: post.currentPost,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    shareLink({
      link: post.currentPost.post.ap_id,
      title: post.currentPost.post.name,
    });
  };

  const isUpvoted = post.currentPost?.my_vote === 1;
  const isDownvoted = post.currentPost?.my_vote === -1;

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <HStack justifyContent="space-between" alignItems="center" mb={2} mx={4}>
      <VoteButton
        onPressHandler={() => onVotePress(1)}
        type="upvote"
        isVoted={isUpvoted}
        text={post.currentPost.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={() => onVotePress(-1)}
        type="downvote"
        isVoted={isDownvoted}
        text={post.currentPost.counts.downvotes}
        isAccented
      />

      <IconButton
        icon={
          <IconBookmark
            size={25}
            color={
              post.bookmarked ? colors.app.textPrimary : colors.app.accentColor
            }
          />
        }
        onPress={post.doBookmark}
        backgroundColor={
          post.bookmarked ? colors.green[500] : colors.app.backgroundSecondary
        }
        padding={2}
      />

      <IconButtonWithText
        onPressHandler={onCommentPress}
        icon={
          <IconMessageCirclePlus color={colors.app.accentColor} size={25} />
        }
      />

      <IconButton
        icon={<IconShare2 size={25} color={colors.app.accentColor} />}
        onPress={onSharePress}
      />
    </HStack>
  );
}

export default PostActionBar;

import { HStack, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBookmark,
  IconMessagePlus,
  IconShare2,
} from "tabler-icons-react-native";
import { PostView } from "lemmy-js-client";
import VoteButton from "../../../common/Vote/VoteButton";
import { useAppDispatch } from "../../../../../store";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import { shareLink } from "../../../../helpers/ShareHelper";
import IconButtonWithText from "../../../common/IconButtonWithText";

interface IProps {
  post: PostView;
  doVote: (value: number) => Promise<void>;
  doSave: () => Promise<void>;
}

function PostActionBar({ post, doVote, doSave }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post,
        languageId: post.post.language_id,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    onGenericHapticFeedback();

    shareLink({
      link: post.post.ap_id,
      title: post.post.name,
    });
  };

  const onUpvotePress = () => {
    doVote(1).then();
  };

  const onDownvotePress = () => {
    doVote(-1).then();
  };

  const isUpvoted = post?.my_vote === 1;
  const isDownvoted = post?.my_vote === -1;

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
        isVoted={isUpvoted}
        text={post.counts.upvotes}
        isAccented
      />

      <VoteButton
        onPressHandler={onDownvotePress}
        type="downvote"
        isVoted={isDownvoted}
        text={post.counts.downvotes}
        isAccented
      />

      <IconButtonWithText
        onPressHandler={doSave}
        icon={
          <IconBookmark
            size={25}
            color={post.saved ? colors.app.bookmarkText : colors.app.accent}
          />
        }
        iconBgColor={post.saved ? colors.app.bookmark : "transparent"}
      />

      <IconButtonWithText
        onPressHandler={onCommentPress}
        icon={<IconMessagePlus color={colors.app.accent} size={25} />}
      />

      <IconButtonWithText
        icon={<IconShare2 size={25} color={colors.app.accent} />}
        onPressHandler={onSharePress}
      />
    </HStack>
  );
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.post.saved === next.post.saved &&
  prev.post.my_vote === next.post.my_vote;

export default React.memo(PostActionBar, areEqual);

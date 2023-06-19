import { HStack, Icon, IconButton, useTheme } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconArrowDown,
  IconArrowUp,
  IconBookmark,
  IconShare2,
} from "tabler-icons-react-native";
import { shareLink } from "../../../helpers/ShareHelper";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { useAppDispatch } from "../../../store";
import usePost from "../../hooks/post/postHooks";

function PostActionBar() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const post = usePost();
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

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <HStack justifyContent="center" space={10} mb={2}>
      <IconButton
        icon={
          <IconArrowUp
            color={
              post.currentPost?.my_vote === 1 ? "white" : colors.accentColor
            }
            size={25}
          />
        }
        onPress={() => onVotePress(1)}
        backgroundColor={
          post.currentPost?.my_vote !== 1 && colors.app.upvoteColor
        }
        padding={2}
      />
      <IconButton
        icon={
          <IconArrowDown
            size={25}
            color={
              post.currentPost?.my_vote === -1 ? "white" : colors.accentColor
            }
          />
        }
        onPress={() => onVotePress(-1)}
        backgroundColor={
          post.currentPost?.my_vote === -1 && colors.app.downvoteColor
        }
        padding={2}
      />
      <IconButton
        icon={
          <IconBookmark
            size={25}
            color={post.bookmarked ? "white" : colors.accentColor}
          />
        }
        onPress={post.doBookmark}
        backgroundColor={post.bookmarked && "green.500"}
        padding={2}
      />
      <IconButton
        icon={<Icon as={Ionicons} name="arrow-undo-outline" />}
        onPress={onCommentPress}
      />
      <IconButton icon={<IconShare2 size={25} />} onPress={onSharePress} />
    </HStack>
  );
}

export default PostActionBar;

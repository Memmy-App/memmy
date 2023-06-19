import React from "react";
import { StyleSheet } from "react-native";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  useToast,
  View,
  VStack,
} from "native-base";
import { PostView } from "lemmy-js-client";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useDispatch } from "react-redux";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { setPost } from "../../../slices/post/postSlice";
import ContentView from "../ContentView";
import { setUpdateVote } from "../../../slices/feed/feedSlice";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import CommunityLink from "../CommunityLink";
import { onVoteHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";

interface FeedItemProps {
  post: PostView;
}

function FeedItem({ post }: FeedItemProps) {
  const dispatch = useDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const toast = useToast();

  const onVotePress = async (value: -1 | 0 | 1) => {
    onVoteHapticFeedback();

    if (value === post.my_vote && value !== 0) value = 0;

    const oldValue = post.my_vote;

    dispatch(
      setUpdateVote({
        postId: post.post.id,
        vote: value,
      })
    );

    try {
      await lemmyInstance.likePost({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        score: value,
      });
    } catch (e) {
      toast.show({
        title: "Error submitting vote...",
        duration: 3000,
      });
      dispatch(
        setUpdateVote({
          postId: post.post.id,
          vote: oldValue as -1 | 0 | 1,
        })
      );
    }
  };

  const onPress = () => {
    dispatch(setPost(post));
    navigation.push("Post");
  };

  return (
    <VStack flex={1} my={1.5} backgroundColor="screen.800" shadow={2}>
      <View mx={4} mt={2}>
        <CommunityLink community={post.community} isFeedItem />
      </View>

      <Pressable onPress={onPress}>
        <>
          <View style={styles.community}>
            {post.community.icon && (
              <FastImage source={{ uri: post.community.icon }} />
            )}
          </View>
          <Text fontSize="lg" mx={4} my={2}>
            {post.post.name}
          </Text>
        </>

        <ContentView post={post} truncate />

        <>
          <HStack mx={4} mb={1}>
            <Text> by </Text>
            <Text fontWeight="bold">{post.creator.name}</Text>

            <Text
              fontSize="sm"
              fontStyle="italic"
              mx={4}
              mt={-1}
              color="screen.400"
              alignSelf="flex-end"
            >
              {post.post.url && getBaseUrl(post.post.url)}
            </Text>
          </HStack>
          <HStack mx={4} alignItems="center" mb={3}>
            <HStack flex={1} space={2}>
              <HStack space={1} alignItems="center">
                {post.counts.upvotes - post.counts.downvotes >= 0 ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
                <Text>{post.counts.upvotes - post.counts.downvotes}</Text>
              </HStack>
              <HStack space={1} alignItems="center">
                <Icon as={Ionicons} name="chatbubble-outline" />
                <Text>{post.counts.comments}</Text>
              </HStack>
              <HStack space={1} alignItems="center">
                <Icon as={Ionicons} name="time-outline" />
                <Text>{moment(post.post.published).utc(true).fromNow()}</Text>
              </HStack>
            </HStack>

            <HStack space={3} alignContent="center" justifyContent="flex-end">
              <IconButton
                icon={
                  <Icon
                    as={Ionicons}
                    name="arrow-up-outline"
                    size={6}
                    onPress={() => onVotePress(1)}
                    color={post.my_vote === 1 ? "white" : "blue.500"}
                  />
                }
                backgroundColor={
                  post.my_vote !== 1 ? "screen.800" : "green.500"
                }
                padding={1}
              />
              <IconButton
                icon={
                  <Icon
                    as={Ionicons}
                    name="arrow-down-outline"
                    size={6}
                    onPress={() => onVotePress(-1)}
                    color={post.my_vote === -1 ? "white" : "blue.500"}
                  />
                }
                backgroundColor={
                  post.my_vote !== -1 ? "screen.800" : "orange.500"
                }
                padding={1}
              />
            </HStack>
          </HStack>
        </>
      </Pressable>
    </VStack>
  );
}

const styles = StyleSheet.create({
  community: {
    flexDirection: "row",
  },

  communityIcon: {
    flex: 1,
    width: 24,
    aspectRatio: 1,
  },

  image: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
  },
});

export default FeedItem;

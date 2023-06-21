import { PostView } from "lemmy-js-client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import FastImage from "react-native-fast-image";
import { IconClockHour5, IconPlanet } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import VoteButton from "../common/VoteButton";
import CommunityLink from "../CommunityLink";
import ContentView from "../ContentView";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import AvatarUsername from "../common/AvatarUsername";
import { timeFromNowShort } from "../../../helpers/TimeHelper";

interface FeedItemProps {
  post: PostView;
}

function FeedItem({ post }: FeedItemProps) {
  const feedItem = useFeedItem(post);
  const theme = useTheme();

  const isUpvoted = post.my_vote === 1;
  const isDownvoted = post.my_vote === -1;

  return (
    <VStack flex={1} my={1.5} backgroundColor="screen.800" shadow={2}>
      <HStack mx={4} mt={2} justifyContent="space-between" alignItems="center">
        <AvatarUsername
          username={post.creator.name}
          avatar={post.creator.avatar}
        />

        <HStack alignItems="center" space={1}>
          <IconClockHour5 size={14} color={theme.colors.app.secondaryText} />
          <Text color={theme.colors.app.secondaryText}>
            {timeFromNowShort(post.post.published)}
          </Text>
          <IconPlanet color={theme.colors.app.secondaryText} size={15} />
          <CommunityLink community={post.community} isFeedItem />
        </HStack>
      </HStack>

      <Pressable onPress={feedItem.onPress}>
        <View style={styles.community}>
          {post.community.icon && (
            <FastImage source={{ uri: post.community.icon }} />
          )}
        </View>
        <Text fontSize="lg" mx={4} my={1}>
          {post.post.name}
        </Text>

        <ContentView post={post} truncate />

        <HStack mx={4} mb={1}>
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
            <VoteButton
              onPressHandler={() => feedItem.onVotePress(1)}
              type="upvote"
              isVoted={isUpvoted}
            />
            <VoteButton
              onPressHandler={() => feedItem.onVotePress(-1)}
              type="downvote"
              isVoted={isDownvoted}
            />
          </HStack>
        </HStack>
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

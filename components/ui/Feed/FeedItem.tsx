import { PostView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "react-native-fast-image";
import {
  IconArrowDown,
  IconArrowUp,
  IconClockHour5,
  IconMessageCircle,
  IconPlanet,
} from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import AvatarUsername from "../common/AvatarUsername";
import VoteButton from "../common/VoteButton";
import CommunityLink from "../CommunityLink";
import ContentView from "../ContentView";

interface FeedItemProps {
  post: PostView;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ post, recycled }: FeedItemProps) {
  const feedItem = useFeedItem(post);
  const theme = useTheme();

  const isUpvoted = post.my_vote === 1;
  const upvoteColor = isUpvoted
    ? theme.colors.app.upvoteColor
    : theme.colors.app.secondaryText;
  const isDownvoted = post.my_vote === -1;
  const downvoteColor = isDownvoted
    ? theme.colors.app.downvoteColor
    : theme.colors.app.secondaryText;

  return (
    <VStack
      flex={1}
      my={1.5}
      backgroundColor={theme.colors.app.backgroundSecondary}
      shadow={2}
    >
      <HStack
        mx={4}
        mt={2}
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <AvatarUsername
          username={post.creator.name}
          fullUsername={`${post.creator.name}@${getBaseUrl(
            post.creator.actor_id
          )}`}
          avatar={post.creator.avatar}
        />

        <HStack alignItems="center" space={1}>
          <IconClockHour5 size={14} color={theme.colors.app.secondaryText} />
          <Text color={theme.colors.app.secondaryText}>
            {timeFromNowShort(post.post.published)}
          </Text>
          <IconPlanet color={theme.colors.app.secondaryText} size={15} />
          <CommunityLink
            community={post.community}
            color={theme.colors.app.secondaryText}
          />
        </HStack>
      </HStack>

      <Pressable onPress={feedItem.onPress}>
        <View style={styles.community}>
          {post.community.icon && (
            <FastImage source={{ uri: post.community.icon }} />
          )}
        </View>
        <Text fontSize="md" mx={4} mb={3}>
          {post.post.name}
        </Text>

        <ContentView post={post} recycled={recycled} truncate />

        {post.post.url && (
          <HStack>
            <Text
              fontSize="sm"
              fontStyle="italic"
              mx={4}
              mt={-1}
              color={theme.colors.app.secondaryText}
              alignSelf="flex-end"
            >
              {getBaseUrl(post.post.url)}
            </Text>
          </HStack>
        )}

        <HStack mx={4} alignItems="center" mb={3}>
          <HStack flex={1} space={1}>
            <HStack alignItems="center">
              <IconArrowUp color={upvoteColor} size={20} />
              <Text color={upvoteColor} fontSize="sm">
                {post.counts.upvotes}
              </Text>
            </HStack>
            <HStack alignItems="center">
              <IconArrowDown color={downvoteColor} size={20} />
              <Text color={downvoteColor} fontSize="sm">
                {post.counts.downvotes}
              </Text>
            </HStack>
            <HStack alignItems="center" ml={1} space={0.5}>
              <IconMessageCircle
                color={theme.colors.app.secondaryText}
                size={20}
              />
              <Text color={theme.colors.app.secondaryText} fontSize="sm">
                {post.counts.comments}
              </Text>
            </HStack>
          </HStack>

          <HStack space={1} alignItems="center" justifyContent="flex-end">
            {/* // TODO: add functionality for bookmark and menu buttons
            <IconButtonWithText
              icon={
                <IconDots size={25} color={theme.colors.app.secondaryText} />
              }
              iconBgColor={theme.colors.app.backgroundSecondary}
              onPressHandler={() => {}}
            />
            <IconButtonWithText
              icon={
                <IconBookmark
                  size={25}
                  color={theme.colors.app.secondaryText}
                />
              }
              iconBgColor={theme.colors.app.backgroundSecondary}
              onPressHandler={() => {}}
            /> */}
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

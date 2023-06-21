import React from "react";
import { PostView } from "lemmy-js-client";
import {
  Box,
  HStack,
  Pressable,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import FastImage from "react-native-fast-image";
import { IconLink, IconMessages, IconUser } from "tabler-icons-react-native";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import { ExtensionType } from "../../../helpers/LinkHelper";
import {
  truncateCompactFeedItem,
  truncateLink,
  truncateName,
} from "../../../helpers/TextHelper";
import VoteButton from "../common/VoteButton";
import SmallVoteIcons from "../common/SmallVoteIcons";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";

function CompactFeedItem({ post }: { post: PostView }) {
  const feedItem = useFeedItem(post);
  const theme = useTheme();

  const isUpvoted = post.my_vote === 1;
  const isDownvoted = post.my_vote === -1;

  return (
    <Pressable onPress={feedItem.onPress}>
      <HStack
        flex={1}
        my={1}
        px={3}
        py={4}
        backgroundColor={theme.colors.app.backgroundSecondary}
        space={2}
      >
        <Box
          width={75}
          height={75}
          backgroundColor={theme.colors.app.backgroundTricondary}
          borderRadius={10}
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
        >
          {(feedItem.linkInfo.extType === ExtensionType.IMAGE && (
            <FastImage
              source={{ uri: post.post.url }}
              style={{
                height: 75,
                width: 75,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          )) ||
            (feedItem.linkInfo.extType === ExtensionType.NONE && (
              <IconMessages size={40} color={theme.colors.app.iconColor} />
            )) || <IconLink size={40} color={theme.colors.app.iconColor} />}
        </Box>
        <VStack flex={1} space={1}>
          <Text flex={1} fontSize={17}>
            {truncateCompactFeedItem(post.post.name)}
          </Text>
          <HStack alignItems="center" space={2}>
            {(post.creator.avatar && (
              <FastImage
                source={{
                  uri: post.creator.avatar,
                }}
                style={{ height: 19, width: 19, borderRadius: 100 }}
              />
            )) || <IconUser size={19} color={theme.colors.app.iconColor} />}
            <Text fontWeight="semibold">{post.creator.name}</Text>
          </HStack>
          <HStack flex={1}>
            <SmallVoteIcons
              upvotes={post.counts.upvotes}
              downvotes={post.counts.downvotes}
              myVote={post.my_vote as ILemmyVote}
            />
            <View alignSelf="flex-end">
              <Text>
                to{"  "}
                {post.community.name}
              </Text>
            </View>
          </HStack>
        </VStack>
        <VStack
          justifyContent="center"
          alignItems="center"
          justifyItems="center"
          space={5}
        >
          <VoteButton
            onPressHandler={() => feedItem.onVotePress(1)}
            type="upvote"
            isVoted={feedItem.myVote === 1}
          />
          <VoteButton
            onPressHandler={() => feedItem.onVotePress(-1)}
            type="downvote"
            isVoted={feedItem.myVote === -1}
          />
        </VStack>
      </HStack>
    </Pressable>
  );
}

export default CompactFeedItem;

import React, { useEffect, useMemo, useState } from "react";
import { PostView } from "lemmy-js-client";
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import FastImage from "react-native-fast-image";
import {
  IconLink,
  IconMessage,
  IconMessages,
  IconPlanet,
  IconUser,
} from "tabler-icons-react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import {
  truncateCompactFeedItem,
  truncateName,
} from "../../../helpers/TextHelper";
import VoteButton from "../common/VoteButton";
import SmallVoteIcons from "../common/SmallVoteIcons";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import ImageView from "../image/ImageView";

function CompactFeedItem({ post }: { post: PostView }) {
  const feedItem = useFeedItem(post);
  const theme = useTheme();

  const isUpvoted = post.my_vote === 1;
  const isDownvoted = post.my_vote === -1;

  useEffect(() => {}, []);

  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  return useMemo(
    () => (
      <Pressable onPress={feedItem.onPress}>
        <HStack
          flex={1}
          my={0.5}
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
              <>
                {post.post.nsfw ? (
                  <Pressable onPress={onImagePress} onLongPress={onImageLongPress}>
                    <View style={styles.blurContainer}>
                      <BlurView
                        style={styles.blurView}
                        intensity={100}
                        tint="dark"
                      >
                        <VStack
                          flex={1}
                          alignItems="center"
                          justifyContent="center"
                          space={2}
                        >
                          <Icon
                            as={Ionicons}
                            name="alert-circle"
                            color={theme.colors.app.primaryText}
                            size={12}
                            alignSelf="center"
                            style={styles.nsfwIcon}
                          />
                        </VStack>
                      </BlurView>
                      <FastImage
                        resizeMode="cover"
                        style={styles.image}
                        source={{
                          uri: post.post.url,
                        }}
                      />
                    </View>
                  </Pressable>
                ) : (
                  <Pressable onPress={onImagePress} onLongPress={onImageLongPress}>
                    <FastImage
                      resizeMode="cover"
                      style={styles.image}
                      source={{
                        uri: post.post.url,
                      }}
                    />
                  </Pressable>
                )}
                <ImageView
                  source={post.post.url}
                  setIsOpen={setImageViewOpen}
                  isOpen={imageViewOpen}
                />
              </>
            )) ||
              (feedItem.linkInfo.extType === ExtensionType.NONE && (
                <IconMessages size={40} color={theme.colors.app.iconColor} />
              )) || <IconLink size={40} color={theme.colors.app.iconColor} />}
          </Box>
          <VStack flex={1}>
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
              <Text fontWeight="semibold">
                {truncateName(post.creator.name)}
              </Text>
              <Text color={theme.colors.app.secondaryText}>•</Text>
              <Text color={theme.colors.app.secondaryText}>
                {timeFromNowShort(post.post.published)}
              </Text>
            </HStack>
            <HStack flex={1} alignItems="center" space={2}>
              <SmallVoteIcons
                upvotes={post.counts.upvotes}
                downvotes={post.counts.downvotes}
                myVote={post.my_vote as ILemmyVote}
              />
              <HStack alignItems="center" space={1}>
                <IconMessage color={theme.colors.app.iconColor} size={16} />
                <Text>{post.counts.comments}</Text>
              </HStack>
              <HStack alignItems="center" space={1}>
                <IconPlanet color={theme.colors.app.iconColor} size={16} />
                <Text>{truncateName(post.community.name)}</Text>
              </HStack>
            </HStack>
          </VStack>
          <VStack justifyContent="flex-start" alignItems="center" space={3}>
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
          </VStack>
        </HStack>
      </Pressable>
    ),
    [post, imageViewOpen]
  );
}

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75,
    borderRadius: 10,
  },

  blurView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 1,
  },

  blurContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
    borderRadius: 10,
  },

  nsfwIcon: {
    marginLeft: 5,
  },
});

export default CompactFeedItem;

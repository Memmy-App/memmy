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
  IconArrowDown,
  IconArrowUp,
  IconLink,
  IconMessage,
  IconMessages,
  IconPlanet,
  IconUser,
} from "tabler-icons-react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import { ExtensionType } from "../../../helpers/LinkHelper";
import {
  truncateCompactFeedItem,
  truncateName,
} from "../../../helpers/TextHelper";
import VoteButton from "../common/VoteButton";
import SmallVoteIcons from "../common/SmallVoteIcons";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import useSwipeAnimation from "../../hooks/animations/useSwipeAnimation";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { useAppDispatch } from "../../../store";
import ImageModal from "../image/ImageModal";

function CompactFeedItem({ post }: { post: PostView }) {
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const feedItem = useFeedItem(post);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const isUpvoted = post.my_vote === 1;
  const isDownvoted = post.my_vote === -1;

  useEffect(() => {}, []);

  const onLeftRightOne = () => feedItem.onVotePress(1, false);
  const onLeftRightTwo = () => feedItem.onVotePress(-1, false);
  const onRightLeftOne = () => {
    dispatch(
      setResponseTo({
        post,
      })
    );
    navigation.push("NewComment");
  };
  const onRightLeftTwo = () => {};
  const leftRightOneIcon = <IconArrowUp size={32} color="#fff" />;
  const leftRightTwoIcon = <IconArrowDown size={32} color="#fff" />;
  const rightLeftOneIcon = <IconMessage size={32} color="#fff" />;
  const rightLeftTwoIcon = <IconMessage size={32} color="#fff" />;

  const swipeAnimation = useSwipeAnimation({
    onLeftRightOne,
    onLeftRightTwo,
    onRightLeftOne,
    onRightLeftTwo,
    leftRightOneIcon,
    leftRightTwoIcon,
    rightLeftOneIcon,
    rightLeftTwoIcon,
  });

  const onImagePress = () => {
    setImageViewOpen(true);
  };

  const onImageLongPress = () => {};

  return useMemo(
    () => (
      <View flex={1} my={0.5}>
        <View style={styles.backgroundContainer}>
          <View
            style={styles.backgroundLeft}
            justifyContent="center"
            backgroundColor={swipeAnimation.color}
            pl={4}
          >
            {swipeAnimation.leftIcon}
          </View>
          <View
            style={styles.backgroundLeft}
            backgroundColor={swipeAnimation.color}
          />
          <View
            style={styles.backgroundRight}
            justifyContent="center"
            backgroundColor="#007AFF"
            alignItems="flex-end"
            pr={4}
          >
            {swipeAnimation.rightIcon}
          </View>
        </View>
        <PanGestureHandler
          onGestureEvent={swipeAnimation.gestureHandler}
          minPointers={1}
          maxPointers={1}
          activeOffsetX={[-20, 20]}
          hitSlop={{ left: -25 }}
        >
          <Animated.View style={[swipeAnimation.animatedStyle]}>
            <Pressable onPress={feedItem.onPress}>
              <HStack
                flex={1}
                px={3}
                py={4}
                backgroundColor={theme.colors.app.bgSecondary}
                space={2}
              >
                <Box
                  width={75}
                  height={75}
                  backgroundColor={theme.colors.app.bgTertiary}
                  borderRadius={10}
                  justifyContent="center"
                  alignItems="center"
                  alignSelf="center"
                >
                  {(feedItem.linkInfo.extType === ExtensionType.IMAGE && (
                    <>
                      {post.post.nsfw ? (
                        <Pressable
                          onPress={onImagePress}
                          onLongPress={onImageLongPress}
                        >
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
                                  color={theme.colors.app.textPrimary}
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
                        <Pressable
                          onPress={onImagePress}
                          onLongPress={onImageLongPress}
                        >
                          <FastImage
                            resizeMode="cover"
                            style={styles.image}
                            source={{
                              uri: post.post.url,
                            }}
                          />
                        </Pressable>
                      )}
                      <ImageModal
                        source={post.post.url}
                        width={Dimensions.get("screen").width}
                        height={Dimensions.get("screen").height}
                        isOpen={imageViewOpen}
                        onRequestClose={() => {
                          setImageViewOpen(false);
                        }}
                      />
                    </>
                  )) ||
                    (feedItem.linkInfo.extType === ExtensionType.NONE && (
                      <IconMessages
                        size={40}
                        color={theme.colors.app.textSecondary}
                      />
                    )) || (
                      <IconLink
                        size={40}
                        color={theme.colors.app.textSecondary}
                      />
                    )}
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
                    )) || (
                      <IconUser
                        size={19}
                        color={theme.colors.app.textSecondary}
                      />
                    )}
                    <Text fontWeight="semibold">
                      {truncateName(post.creator.name)}
                    </Text>
                    <Text color={theme.colors.app.textSecondary}>•</Text>
                    <Text color={theme.colors.app.textSecondary}>
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
                      <IconMessage
                        color={theme.colors.app.textSecondary}
                        size={16}
                      />
                      <Text>{post.counts.comments}</Text>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <IconPlanet
                        color={theme.colors.app.textSecondary}
                        size={16}
                      />
                      <Text>{truncateName(post.community.name)}</Text>
                    </HStack>
                  </HStack>
                </VStack>
                <VStack
                  justifyContent="flex-start"
                  alignItems="center"
                  space={3}
                >
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
          </Animated.View>
        </PanGestureHandler>
      </View>
    ),
    [post, swipeAnimation.leftIcon, swipeAnimation.rightIcon, imageViewOpen]
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

  side: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    marginLeft: -4,
  },

  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: "row",
  },

  backgroundLeft: {
    flex: 1,
  },

  backgroundRight: {
    flex: 1,
  },
});

export default CompactFeedItem;

import { PostView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import React, { SetStateAction, useMemo } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  IconArrowDown,
  IconArrowUp,
  IconClockHour5,
  IconMessage,
} from "tabler-icons-react-native";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { useAppDispatch } from "../../../store";
import useSwipeAnimation from "../../hooks/animations/useSwipeAnimation";
import useFeedItem from "../../hooks/feeds/useFeedItem";
import AvatarUsername from "../common/AvatarUsername";
import VoteButton from "../common/VoteButton";
import CommunityLink from "../CommunityLink";
import ContentView from "../ContentView";
import FeaturedIndicator from "../common/FeaturedIndicator";

interface FeedItemProps {
  post: PostView;
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ post, setPosts, recycled }: FeedItemProps) {
  const feedItem = useFeedItem(post, setPosts);
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const onLeftRightOne = () => feedItem.onVotePress(1, false);
  const onLeftRightTwo = () => feedItem.onVotePress(-1, false);
  const onRightLeftOne = () => {
    dispatch(
      setResponseTo({
        post,
        languageId: post.post.language_id,
      })
    );
    navigation.push("NewComment");
  };
  const leftRightOneIcon = <IconArrowUp size={32} color="#fff" />;
  const leftRightTwoIcon = <IconArrowDown size={32} color="#fff" />;
  const rightLeftOneIcon = <IconMessage size={32} color="#fff" />;

  const swipeAnimation = useSwipeAnimation({
    onLeftRightOne,
    onLeftRightTwo,
    onRightLeftOne,
    leftRightOneIcon,
    leftRightTwoIcon,
    rightLeftOneIcon,
  });

  const isUpvoted = post.my_vote === 1;
  const upvoteColor = isUpvoted
    ? theme.colors.app.upvote
    : theme.colors.app.textSecondary;
  const isDownvoted = post.my_vote === -1;
  const downvoteColor = isDownvoted
    ? theme.colors.app.downvote
    : theme.colors.app.textSecondary;

  return useMemo(
    () => (
      <View flex={1} mb={2}>
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
            <VStack backgroundColor={theme.colors.app.fg}>
              <HStack
                mx={4}
                mt={2}
                mb={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space={2}>
                  <AvatarUsername creator={post.creator} />
                  <FeaturedIndicator post={post} />
                </HStack>

                <HStack alignItems="center" space={1}>
                  <IconClockHour5
                    size={16}
                    color={theme.colors.app.textSecondary}
                  />
                  <Text color={theme.colors.app.textSecondary}>
                    {timeFromNowShort(post.post.published)}
                  </Text>
                  <CommunityLink
                    community={post.community}
                    color={theme.colors.app.textSecondary}
                  />
                </HStack>
              </HStack>

              <Pressable onPress={feedItem.onPress}>
                <View style={styles.community}>
                  {post.community.icon && (
                    <FastImage source={{ uri: post.community.icon }} />
                  )}
                </View>

                <ContentView
                  post={post}
                  recycled={recycled}
                  isPreview
                  setPostRead={feedItem.setPostRead}
                />

                <HStack mx={4} alignItems="center" mb={3} mt={1}>
                  <HStack flex={1} space={1}>
                    <HStack alignItems="center">
                      <IconArrowUp color={upvoteColor} size={20} />
                      <Text color={upvoteColor} fontSize="sm">
                        {post.my_vote === 1
                          ? post.counts.upvotes + 1
                          : post.counts.upvotes}
                      </Text>
                    </HStack>
                    <HStack alignItems="center">
                      <IconArrowDown color={downvoteColor} size={20} />
                      <Text color={downvoteColor} fontSize="sm">
                        {post.my_vote === -1
                          ? post.counts.downvotes + 1
                          : post.counts.downvotes}
                      </Text>
                    </HStack>
                    <HStack alignItems="center" ml={1} space={0.5}>
                      <IconMessage
                        color={theme.colors.app.textSecondary}
                        size={20}
                      />
                      <Text
                        color={theme.colors.app.textSecondary}
                        fontSize="sm"
                      >
                        {post.counts.comments}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack
                    space={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {/* // TODO: add functionality for bookmark and menu buttons
            <IconButtonWithText
              icon={
                <IconDots size={25} color={theme.colors.app.textSecondary} />
              }
              iconBgColor={theme.colors.app.bg}
              onPressHandler={() => {}}
            />
            <IconButtonWithText
              icon={
                <IconBookmark
                  size={25}
                  color={theme.colors.app.textSecondary}
                />
              }
              iconBgColor={theme.colors.app.bg}
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
          </Animated.View>
        </PanGestureHandler>
      </View>
    ),
    [post, swipeAnimation.leftIcon, swipeAnimation.rightIcon]
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

export default FeedItem;

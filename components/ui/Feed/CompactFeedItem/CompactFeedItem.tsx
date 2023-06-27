import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { PostView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import {
  IconArrowDown,
  IconArrowUp,
  IconMessage,
} from "tabler-icons-react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import useFeedItem from "../../../hooks/feeds/useFeedItem";
import { truncateCompactFeedItem } from "../../../../helpers/TextHelper";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";
import useSwipeAnimation from "../../../hooks/animations/useSwipeAnimation";
import { setResponseTo } from "../../../../slices/newComment/newCommentSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import CompactFeedItemThumbnail from "./CompactFeedItemThumbnail";
import CompactFeedItemVote from "./CompactFeedItemVote";
import CompactFeedItemFooter from "./CompactFeedItemFooter";
import { selectSettings } from "../../../../slices/settings/settingsSlice";

function CompactFeedItem({
  post,
  setPosts,
}: {
  post: PostView;
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
}) {
  const { compactThumbnailPosition, compactShowVotingButtons } =
    useAppSelector(selectSettings);
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const feedItem = useFeedItem(post, setPosts);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
                {compactThumbnailPosition === "Left" && (
                  <CompactFeedItemThumbnail
                    post={post}
                    setImageViewOpen={setImageViewOpen}
                    imageViewOpen={imageViewOpen}
                  />
                )}

                <VStack flex={1}>
                  <Text
                    flex={1}
                    fontSize={17}
                    style={
                      post.read ? { color: theme.colors.app.textTertiary } : {}
                    }
                  >
                    {truncateCompactFeedItem(post.post.name)}
                  </Text>

                  <CompactFeedItemFooter post={post} />
                </VStack>

                {compactThumbnailPosition === "Right" && (
                  <VStack alignItems="flex-start">
                    <CompactFeedItemThumbnail
                      post={post}
                      setImageViewOpen={setImageViewOpen}
                      imageViewOpen={imageViewOpen}
                    />
                  </VStack>
                )}

                {compactShowVotingButtons && (
                  <CompactFeedItemVote
                    myVote={post.my_vote as ILemmyVote}
                    post={post}
                  />
                )}
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

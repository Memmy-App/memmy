import React, { SetStateAction, useEffect, useState } from "react";
import { PostView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import {
  IconArrowDown,
  IconArrowUp,
  IconMessage,
} from "tabler-icons-react-native";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import useFeedItem from "../../../hooks/feeds/useFeedItem";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";
import useSwipeAnimation from "../../../hooks/animations/useSwipeAnimation";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import CompactFeedItemThumbnail from "./CompactFeedItemThumbnail";
import CompactFeedItemVote from "./CompactFeedItemVote";
import CompactFeedItemFooter from "./CompactFeedItemFooter";
import { selectSettings } from "../../../../slices/settings/settingsSlice";

import { fontSizeMap } from "../../../../theme/fontSize";
import { VoteOption } from "../../SwipeableRow/VoteOption";
import { ReplyOption } from "../../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../SwipeableRow/SwipeableRow";

function CompactFeedItem({
  post,
  setPosts,
}: {
  post: PostView;
  setPosts?: React.Dispatch<SetStateAction<PostView[]>>;
}) {
  const {
    compactThumbnailPosition,
    compactShowVotingButtons,
    fontWeightPostTitle,
  } = useAppSelector(selectSettings);
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const feedItem = useFeedItem(post, setPosts);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onReply = () => {
    dispatch(
      setResponseTo({
        post,
        languageId: post.post.language_id,
      })
    );
    navigation.push("NewComment");
  };

  const onSwipe = (value: ILemmyVote) => {
    feedItem.onVotePress(value, false);
  };

  const { fontSize, isSystemTextSize } = useAppSelector(selectSettings);
  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 15 / fontScale : 15 + fontModifier;

  // TODO Memoize this properly
  return (
    <View flex={1} my={0.5}>
      <SwipeableRow
        leftOption={<VoteOption onVote={onSwipe} vote={post.my_vote} />}
        rightOption={<ReplyOption onReply={onReply} />}
      >
        <Pressable onPress={feedItem.onPress}>
          <HStack
            flex={1}
            px={2}
            py={1}
            backgroundColor={theme.colors.app.fg}
            space={2}
          >
            {compactThumbnailPosition === "Left" && (
              <CompactFeedItemThumbnail
                post={post}
                setImageViewOpen={setImageViewOpen}
                imageViewOpen={imageViewOpen}
                linkInfo={feedItem.linkInfo}
                setPostRead={feedItem.setPostRead}
              />
            )}

            <VStack flex={1}>
              <Text
                flex={1}
                fontSize={FONT_SIZE}
                fontWeight={fontWeightPostTitle}
                color={
                  post.read
                    ? theme.colors.app.textSecondary
                    : theme.colors.app.textPrimary
                }
              >
                {post.post.name}
              </Text>

              <CompactFeedItemFooter post={post} />
            </VStack>

            {compactThumbnailPosition === "Right" && (
              <VStack alignItems="flex-start">
                <CompactFeedItemThumbnail
                  post={post}
                  setImageViewOpen={setImageViewOpen}
                  imageViewOpen={imageViewOpen}
                  linkInfo={feedItem.linkInfo}
                  setPostRead={feedItem.setPostRead}
                />
              </VStack>
            )}

            {compactShowVotingButtons && (
              <CompactFeedItemVote
                myVote={post.my_vote as ILemmyVote}
                onVotePress={feedItem.onVotePress}
              />
            )}
          </HStack>
        </Pressable>
      </SwipeableRow>
    </View>
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

export default React.memo(CompactFeedItem);

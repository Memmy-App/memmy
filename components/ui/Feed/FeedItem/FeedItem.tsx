import { PostView } from "lemmy-js-client";
import { Pressable, View, useTheme } from "native-base";
import React, { memo, SetStateAction, useMemo } from "react";
import { ColorValue, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  IconArrowDown,
  IconArrowUp,
  IconMessage,
} from "tabler-icons-react-native";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import { useAppDispatch } from "../../../../store";
import useSwipeAnimation from "../../../hooks/animations/useSwipeAnimation";
import useFeedItem from "../../../hooks/feeds/useFeedItem";
import CommunityLink from "../../CommunityLink";
import FeedContentPreview from "../FeedContentPreview";
import { Actions } from "./Actions";
import { ByLine } from "./ByLine";
import { Footer, Header } from "./Layout";
import { Metrics } from "./Metrics";
import { Post } from "./Post";
import { SwipeableRow } from "../../common/SwipeableRow";
import { VoteOption } from "../../common/SwipeableRow/options/VoteOptions";

interface FeedItemProps {
  post: PostView;
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ post, setPosts, recycled }: FeedItemProps) {
  const theme = useTheme();
  const feedItem = useFeedItem(post, setPosts);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const votingColors = useMemo(() => {
    return {
      upvote: {
        background: theme.colors.app.upvote as ColorValue,
      },
      downvote: {
        background: theme.colors.app.downvote as ColorValue,
      },
    };
  }, [theme]);

  const onUpVote = () => {
    feedItem.onVotePress(1, false);
  };

  const onDownVote = () => {
    feedItem.onVotePress(-1, false);
  };

  // const onLeftRightOne = () => feedItem.onVotePress(1, false);
  // const onLeftRightTwo = () => feedItem.onVotePress(-1, false);
  // const onRightLeftOne = () => {
  //   dispatch(
  //     setResponseTo({
  //       post,
  //       languageId: post.post.language_id,
  //     })
  //   );
  //   navigation.push("NewComment");
  // };
  // const leftRightOneIcon = <IconArrowUp size={32} color="#fff" />;
  // const leftRightTwoIcon = <IconArrowDown size={32} color="#fff" />;
  // const rightLeftOneIcon = <IconMessage size={32} color="#fff" />;

  // const swipeAnimation = useSwipeAnimation({
  //   onLeftRightOne,
  //   onLeftRightTwo,
  //   onRightLeftOne,
  //   leftRightOneIcon,
  //   leftRightTwoIcon,
  //   rightLeftOneIcon,
  // });

  return (
    <View flex={1} mb={2}>
      {/* <View style={styles.backgroundContainer}>
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
      </View> */}
      {/* <PanGestureHandler
        onGestureEvent={swipeAnimation.gestureHandler}
        minPointers={1}
        maxPointers={1}
        activeOffsetX={[-20, 20]}
        hitSlop={{ left: -25 }}
      >
        <Animated.View style={[swipeAnimation.animatedStyle]}> */}
      <SwipeableRow
        leftOption={
          <VoteOption
            vote={feedItem.myVote}
            voteColors={votingColors}
            onUpVote={onUpVote}
            onDownVote={onDownVote}
          />
        }
      >
        <Post>
          <Header>
            <ByLine
              creator={post.creator}
              read={post.read}
              featured={
                post.post.featured_local || post.post.featured_community
              }
            />
            <CommunityLink community={post.community} />
          </Header>

          <Pressable onPress={feedItem.onPress}>
            <View style={styles.community}>
              {post.community.icon && (
                <FastImage source={{ uri: post.community.icon }} />
              )}
            </View>

            <FeedContentPreview
              post={post}
              recycled={recycled}
              setPostRead={feedItem.setPostRead}
            />

            <Footer>
              <Metrics data={post.counts} vote={post.my_vote} />
              <Actions
                saved={post.saved}
                vote={post.my_vote}
                onSave={feedItem.doSave}
                onVotePress={feedItem.onVotePress}
              />
            </Footer>
          </Pressable>
        </Post>
      </SwipeableRow>
    </View>
  );
}

const styles = StyleSheet.create({
  community: {
    flexDirection: "row",
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

export default memo(FeedItem);

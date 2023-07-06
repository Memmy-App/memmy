import { PostView } from "lemmy-js-client";
import { Pressable, View } from "native-base";
import React, { memo, SetStateAction } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { setResponseTo } from "../../../../slices/comments/newCommentSlice";
import { useAppDispatch } from "../../../../store";
import useFeedItem from "../../../hooks/feeds/useFeedItem";
import FeedContentPreview from "../FeedContentPreview";
import { Actions } from "./Actions";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Metrics } from "./Metrics";
import { Post } from "./Post";
import { VoteOption } from "../../SwipeableRow/VoteOption";
import { ReplyOption } from "../../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../SwipeableRow/SwipeableRow";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";

interface FeedItemProps {
  post: PostView;
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ post, setPosts, recycled }: FeedItemProps) {
  const feedItem = useFeedItem(post, setPosts);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
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

  return (
    <View py={1}>
      <SwipeableRow
        leftOption={<VoteOption onVote={onSwipe} vote={post.my_vote} />}
        rightOption={<ReplyOption onReply={onReply} />}
      >
        <Post>
          <Header
            community={post.community}
            featured={post.post.featured_local || post.post.featured_community}
            isRead={post.read}
          />

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

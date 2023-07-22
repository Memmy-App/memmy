import { HStack, Pressable, View } from "native-base";
import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "@gkasdorf/react-native-fast-image";
import { useRoute } from "@react-navigation/core";
import useFeedItem from "../../../../../hooks/feeds/useFeedItem";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import AvatarUsername from "../../../../common/AvatarUsername";
import { FeedItemContextMenu } from "../../../../common/ContextMenu/FeedItemContextMenu";
import { ReplyOption } from "../../../../common/SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../../../common/SwipeableRow/SwipeableRow";
import { VoteOption } from "../../../../common/SwipeableRow/VoteOption";
import FeedContentPreview from "../FeedContentPreview";
import { Actions } from "./Actions";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Metrics } from "./Metrics";
import { Post } from "./Post";
import { useFeedPost } from "../../../../../stores/feeds/feedsStore";

interface FeedItemProps {
  postId: number;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ postId, recycled }: FeedItemProps) {
  const { key } = useRoute();

  const feedItem = useFeedItem(postId);
  const post = useFeedPost(key, postId);

  const onSwipe = useCallback(
    (value: ILemmyVote) => {
      feedItem.onVotePress(value, false).then();
    },
    [postId]
  );

  const leftOption = useMemo(
    () => <VoteOption onVote={onSwipe} vote={post.my_vote} />,
    [post.my_vote, postId]
  );

  const rightOption = useMemo(
    () => <ReplyOption onReply={feedItem.doReply} />,
    [postId]
  );

  return (
    <FeedItemContextMenu feedItem={feedItem}>
      <View py={1}>
        <SwipeableRow leftOption={leftOption} rightOption={rightOption}>
          <Post>
            <Header
              community={post.community}
              featured={
                post.post.featured_local || post.post.featured_community
              }
              isRead={post.read}
              feedItem={feedItem}
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
                setPostRead={() => {}}
              />

              <HStack mx={4} mt={1}>
                <AvatarUsername creator={post.creator} />
              </HStack>

              <Footer>
                <Metrics data={post.counts} vote={post.my_vote} />
                <Actions
                  saved={post.saved}
                  vote={post.my_vote}
                  onSave={feedItem.doSave}
                  onVotePress={feedItem.onVotePress}
                  id={post.post.id}
                />
              </Footer>
            </Pressable>
          </Post>
        </SwipeableRow>
      </View>
    </FeedItemContextMenu>
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

import { HStack, Pressable, View } from "@src/components/common/Gluestack";
import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "@gkasdorf/react-native-fast-image";
import { useRoute } from "@react-navigation/core";
import AvatarUsername from "@src/components/common/AvatarUsername";
import { FeedItemContextMenu } from "@src/components/common/ContextMenu/FeedItemContextMenu";
import { ReplyOption } from "@src/components/common/SwipeableRow/ReplyOption";
import { SwipeableRow } from "@src/components/common/SwipeableRow/SwipeableRow";
import { VoteOption } from "@src/components/common/SwipeableRow/VoteOption";
import {
  useFeedPostCommunity,
  useFeedPostCreator,
  useFeedPostInfo,
  useFeedPostRead,
  useFeedPostSaved,
  useFeedPostVote,
} from "@src/stores/feeds/feedsStore";
import { ILemmyVote } from "@src/types/lemmy/ILemmyVote";
import useFeedItem from "../../../../../hooks/feeds/useFeedItem";
import FeedContentPreview from "../FeedContentPreview";
import { Actions } from "./Actions";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Metrics } from "./Metrics";
import { Post } from "./Post";

interface FeedItemProps {
  postId: number;
  recycled: React.MutableRefObject<{}>;
}

function FeedItem({ postId, recycled }: FeedItemProps) {
  const { key } = useRoute();

  const feedItem = useFeedItem(postId);
  const postVote = useFeedPostVote(key, postId);
  const postSaved = useFeedPostSaved(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);
  const postInfo = useFeedPostInfo(key, postId);
  const postRead = useFeedPostRead(key, postId);
  const postCreator = useFeedPostCreator(key, postId);

  const onSwipe = useCallback(
    (value: ILemmyVote) => {
      feedItem.onVotePress(value, false).then();
    },
    [postId]
  );

  const leftOption = useMemo(
    () => <VoteOption onVote={onSwipe} vote={postVote} />,
    [postVote, postId]
  );

  const rightOption = useMemo(
    () => (
      <ReplyOption
        onReply={feedItem.doReply}
        onExtra={feedItem.doSave}
        extraType="Save"
      />
    ),
    [postId, postSaved]
  );

  return (
    <FeedItemContextMenu feedItem={feedItem}>
      <View py="$1">
        <SwipeableRow leftOption={leftOption} rightOption={rightOption}>
          <Post>
            <Header
              community={postCommunity}
              featured={postInfo.featured_local || postInfo.featured_community}
              isRead={postRead}
              feedItem={feedItem}
            />

            <Pressable onPress={feedItem.onPress}>
              <View style={styles.community}>
                {postCommunity.icon && (
                  <FastImage source={{ uri: postCommunity.icon }} />
                )}
              </View>

              <FeedContentPreview postId={postId} recycled={recycled} />

              <HStack mx="$4" mt="$1">
                <AvatarUsername creator={postCreator} />
              </HStack>

              <Footer>
                <Metrics postId={postId} />
                <Actions
                  saved={postSaved}
                  vote={postVote}
                  onSave={feedItem.doSave}
                  onVotePress={feedItem.onVotePress}
                  id={postId}
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

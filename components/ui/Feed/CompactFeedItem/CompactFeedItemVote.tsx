import { VStack } from "native-base";
import React from "react";
import { PostView } from "lemmy-js-client";
import VoteButton from "../../common/VoteButton";
import useFeedItem from "../../../hooks/feeds/useFeedItem";

interface CompactFeedItemVoteProps {
  myVote: number;
  post: PostView;
}

function CompactFeedItemVote({ myVote, post }: CompactFeedItemVoteProps) {
  const feedItem = useFeedItem(post);
  const isUpvoted = myVote === 1;
  const isDownvoted = myVote === -1;

  return (
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
  );
}

export default CompactFeedItemVote;

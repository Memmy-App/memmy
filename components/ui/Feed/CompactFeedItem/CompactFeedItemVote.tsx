import { VStack } from "native-base";
import React from "react";
import VoteButton from "../../common/VoteButton";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";

function CompactFeedItemVote({
  myVote,
  onVotePress,
}: {
  myVote: number;
  onVotePress: (value: ILemmyVote) => void;
}) {
  const isUpvoted = myVote === 1;
  const isDownvoted = myVote === -1;

  return (
    <VStack justifyContent="flex-start" alignItems="center" space={3}>
      <VoteButton
        onPressHandler={() => onVotePress(1)}
        type="upvote"
        isVoted={isUpvoted}
      />
      <VoteButton
        onPressHandler={() => onVotePress(-1)}
        type="downvote"
        isVoted={isDownvoted}
      />
    </VStack>
  );
}

export default CompactFeedItemVote;

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
  return (
    <VStack justifyContent="flex-start" alignItems="center" space={3}>
      <VoteButton
        onPressHandler={() => onVotePress(myVote === 1 ? 0 : 1)}
        type="upvote"
        isVoted={myVote === 1}
      />
      <VoteButton
        onPressHandler={() => onVotePress(myVote === -1 ? 0 : -1)}
        type="downvote"
        isVoted={myVote === -1}
      />
    </VStack>
  );
}

export default CompactFeedItemVote;

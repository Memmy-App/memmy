import { VStack } from "@components/common/Gluestack";
import React from "react";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import VoteButton from "../../../../common/Vote/VoteButton";

function CompactFeedItemVote({
  myVote,
  onVotePress,
}: {
  myVote: number;
  onVotePress: (value: ILemmyVote) => void;
}) {
  return (
    <VStack justifyContent="flex-start" alignItems="center" space="3">
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

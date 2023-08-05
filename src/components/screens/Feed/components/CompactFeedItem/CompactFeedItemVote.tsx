import { VStack } from "@src/components/common/Gluestack";
import React, { useCallback } from "react";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import VoteButton from "../../../../common/Vote/VoteButton";

function CompactFeedItemVote({
  myVote,
  onVotePress,
  id,
}: {
  myVote: number;
  onVotePress: (value: ILemmyVote) => void;
  id: number;
}) {
  const onUpvote = useCallback(() => {
    onVotePress(myVote === 1 ? 0 : 1);
  }, [myVote, id]);

  const onDownvote = useCallback(() => {
    onVotePress(myVote === -1 ? 0 : -1);
  }, [myVote, id]);

  return (
    <VStack justifyContent="flex-start" alignItems="center" space="md">
      <VoteButton
        onPressHandler={onUpvote}
        type="upvote"
        isVoted={myVote === 1}
      />
      <VoteButton
        onPressHandler={onDownvote}
        type="downvote"
        isVoted={myVote === -1}
      />
    </VStack>
  );
}

export default React.memo(CompactFeedItemVote);

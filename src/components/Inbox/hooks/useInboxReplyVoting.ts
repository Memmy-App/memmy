import {
  useReplyDownvotes,
  useReplyMyVote,
  useReplyScore,
  useReplyUpvotes,
} from '@src/state';
import { useCallback } from 'react';
import { likeReply } from '@src/state/inbox/actions';

interface UseInboxReplyVoting {
  upvotes: number | undefined;
  downvotes: number | undefined;
  score: number | undefined;
  myVote: number | undefined;

  upvote: () => void;
  downvote: () => void;
  scoreVote: () => void;
}

export const useInboxReplyVoting = (
  itemId: number,
  commentId: number,
): UseInboxReplyVoting => {
  const upvotes = useReplyUpvotes(itemId);
  const downvotes = useReplyDownvotes(itemId);
  const score = useReplyScore(itemId);
  const myVote = useReplyMyVote(itemId);

  const upvote = useCallback(() => {
    likeReply(itemId, 1);
  }, [itemId]);

  const downvote = useCallback(() => {
    likeReply(itemId, -1);
  }, [itemId]);

  const scoreVote = useCallback(() => {
    switch (myVote) {
      case 0:
        likeReply(itemId, 1);
        break;
      case 1:
        likeReply(itemId, 0);
        break;
      case -1:
        likeReply(itemId, -1);
        break;
    }
  }, [itemId, myVote]);

  return {
    upvotes,
    downvotes,
    score,
    myVote,

    upvote,
    downvote,
    scoreVote,
  };
};

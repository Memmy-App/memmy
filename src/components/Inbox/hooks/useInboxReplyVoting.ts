import {
  likeReply,
  useMentionDownvotes,
  useMentionMyVote,
  useMentionScore,
  useMentionUpvotes,
  useReplyDownvotes,
  useReplyMyVote,
  useReplyScore,
  useReplyUpvotes,
} from '@src/state';
import { useCallback } from 'react';

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
  type: 'reply' | 'mention',
): UseInboxReplyVoting => {
  const upvotes =
    type === 'reply' ? useReplyUpvotes(itemId) : useMentionUpvotes(itemId);
  const downvotes =
    type === 'reply' ? useReplyDownvotes(itemId) : useMentionDownvotes(itemId);
  const score =
    type === 'reply' ? useReplyScore(itemId) : useMentionScore(itemId);
  const myVote =
    type === 'reply' ? useReplyMyVote(itemId) : useMentionMyVote(itemId);

  const upvote = useCallback(() => {
    likeReply(itemId, 1, type);
  }, [itemId]);

  const downvote = useCallback(() => {
    likeReply(itemId, -1, type);
  }, [itemId]);

  const scoreVote = useCallback(() => {
    switch (myVote) {
      case 0:
        likeReply(itemId, 1, type);
        break;
      case 1:
        likeReply(itemId, 0, type);
        break;
      case -1:
        likeReply(itemId, -1, type);
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

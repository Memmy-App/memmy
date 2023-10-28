import { VoteMetrics } from '@helpers/comments/voteCalculator';
import { useCommentStore } from '@src/state';

export const setCommentScores = (
  commentId: number,
  scores: VoteMetrics,
): void => {
  useCommentStore.setState((state) => {
    const comment = state.comments.get(commentId)?.view;

    if (comment == null) return;

    comment.my_vote = scores.newVote;

    comment.counts = {
      ...comment.counts,
      upvotes: scores.upvotes,
      downvotes: scores.downvotes,
      score: scores.score,
    };
  });
};

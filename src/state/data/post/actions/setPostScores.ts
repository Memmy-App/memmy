import { VoteMetrics } from '@helpers/comments/voteCalculator';
import { usePostStore } from '@src/state';

export const setPostScores = (postId: number, scores: VoteMetrics): void => {
  usePostStore.setState((state) => {
    const post = state.posts.get(postId)?.view;

    if (post == null) return;

    post.my_vote = scores.newVote;
    post.counts = {
      ...post.counts,
      upvotes: scores.upvotes,
      downvotes: scores.downvotes,
      score: scores.score,
    };
  });
};

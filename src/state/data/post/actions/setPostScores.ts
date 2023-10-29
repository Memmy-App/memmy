import { VoteMetrics } from '@helpers/comments/voteCalculator';
import { useDataStore } from '@src/state';

interface SetPostScoresParams {
  postId: number;
  scores: VoteMetrics;
}

export const setPostScores = ({
  postId,
  scores,
}: SetPostScoresParams): void => {
  useDataStore.setState((state) => {
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

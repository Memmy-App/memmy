import { useMemo } from 'react';

interface UseMetricsColors {
  upvoteColor: string;
  downvoteColor: string;
  scoreColor: string;
}

export const useMetricsColors = (myVote?: number): UseMetricsColors => {
  const upvoteColor = useMemo(
    () => (myVote === 1 ? '$upvote' : '$secondary'),
    [myVote],
  );
  const downvoteColor = useMemo(
    () => (myVote === -1 ? '$downvote' : '$secondary'),
    [myVote],
  );
  const scoreColor = useMemo(
    () =>
      myVote === 1 ? '$upvote' : myVote === -1 ? '$downvote' : '$secondary',
    [myVote],
  );

  return {
    upvoteColor,
    downvoteColor,
    scoreColor,
  };
};

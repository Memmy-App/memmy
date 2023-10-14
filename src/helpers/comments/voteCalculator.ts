export interface VoteMetrics {
  upvotes: number;
  downvotes: number;
  score: number;

  myVote: number | undefined;
  newVote: number | undefined;
}

export const voteCalculator = (vms: VoteMetrics): VoteMetrics => {
  if (
    (vms.myVote === 1 && vms.newVote === 1) ||
    (vms.myVote === -1 && vms.newVote === -1)
  ) {
    vms.newVote = 0;
  }

  if (vms.myVote === 1 && vms.newVote === 0) {
    vms.score -= 1;
    vms.upvotes -= 1;
  } else if (vms.myVote === 1) {
    vms.score -= 2;
    vms.upvotes -= 1;
    vms.downvotes += 1;
  } else if (vms.myVote === -1 && vms.newVote === 0) {
    vms.score += 1;
    vms.downvotes -= 1;
  } else if (vms.myVote === -1) {
    vms.score += 2;
    vms.upvotes += 1;
    vms.downvotes -= 1;
  } else if (vms.myVote === 0 || vms.myVote === undefined) {
    if (vms.newVote === 1) {
      vms.score += 1;
      vms.upvotes += 1;
    } else {
      vms.score -= 1;
      vms.downvotes += 1;
    }
  }

  return vms;
};

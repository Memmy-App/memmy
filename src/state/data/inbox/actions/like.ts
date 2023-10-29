import { useInboxStore } from '@src/state';
import { voteCalculator } from '@helpers/comments/voteCalculator';
import instance from '@src/Instance';
import { ILemmyVote } from '@api/lemmy/types';

export const likeReply = (
  replyId: number,
  vote: number,
  type: 'reply' | 'mention',
): void => {
  useInboxStore.setState((state) => {
    let comment;

    if (type === 'reply') comment = state.replies.get(replyId);
    else comment = state.mentions.get(replyId);

    if (comment == null) return;

    const { counts, my_vote: myVote } = comment;

    const oldVms = {
      score: counts.score,
      upvotes: counts.upvotes,
      downvotes: counts.downvotes,
      myVote,
      newVote: vote,
    };

    const newVms = voteCalculator(oldVms);

    void instance.likeCommentWithoutUpdate(
      comment.comment.id,
      newVms.newVote as ILemmyVote,
    );

    comment.counts.score = newVms.score;
    comment.counts.upvotes = newVms.upvotes;
    comment.counts.downvotes = newVms.downvotes;
    comment.my_vote = newVms.newVote;
  });
};

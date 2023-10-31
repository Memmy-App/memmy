import { useDataStore } from '@src/state';
import { voteCalculator } from '@helpers/comments/voteCalculator';
import instance from '@src/Instance';
import { ILemmyVote } from '@api/lemmy/types';

export const likeReply = (
  itemId: number,
  vote: number,
  type: 'reply' | 'mention',
): void => {
  useDataStore.setState((state) => {
    const comment =
      // Get the comment in question
      type === 'reply' ? state.replies.get(itemId) : state.mentions.get(itemId);

    if (comment == null) return;

    // Get the currnet values
    const { counts, my_vote: myVote } = comment;

    const newVms = voteCalculator({
      score: counts.score,
      upvotes: counts.upvotes,
      downvotes: counts.downvotes,
      myVote,
      newVote: vote,
    });

    // Like the comment but don't update the comment state
    void instance.likeCommentWithoutUpdate({
      commentId: comment.comment.id,
      vote: newVms.newVote as ILemmyVote,
    });

    comment.counts.score = newVms.score;
    comment.counts.upvotes = newVms.upvotes;
    comment.counts.downvotes = newVms.downvotes;
    comment.my_vote = newVms.newVote;
  });
};

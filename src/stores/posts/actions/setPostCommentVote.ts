import { IDetermineValue } from "../../../helpers/VoteHelper";
import { usePostsStore } from "../postsStore";
import { likeComment } from "../../../helpers/LemmyActions";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";

const setPostCommentVote = async (
  postKey: string,
  commentId: number,
  newValues: IDetermineValue
) => {
  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey).commentsState.comments;
    const comment = prev.find((c) => c.comment.comment.id === commentId);

    comment.comment.my_vote = newValues.newValue;
    comment.comment.counts.upvotes = newValues.upvotes;
    comment.comment.counts.downvotes = newValues.downvotes;
    comment.comment.counts.score = newValues.upvotes - newValues.downvotes;
  });

  try {
    await likeComment(commentId, newValues.newValue as ILemmyVote);
  } catch (e) {
    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey).commentsState.comments;
      const comment = prev.find((c) => c.comment.comment.id === commentId);

      comment.comment.my_vote = newValues.oldValue;
    });
  }
};

export default setPostCommentVote;

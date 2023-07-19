import { usePostsStore } from "../postsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";
import { IDetermineValue } from "../../../helpers/VoteHelper";

const setPostVote = async (
  postKey: string,
  postId: number,
  newValues: IDetermineValue
) => {
  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey);

    prev.post.my_vote = newValues.newValue;
    prev.post.counts.upvotes = newValues.upvotes;
    prev.post.counts.downvotes = newValues.downvotes;
    prev.post.counts.score = newValues.upvotes - newValues.downvotes;
  });

  try {
    await lemmyInstance.likePost({
      auth: lemmyAuthToken,
      post_id: postId,
      score: newValues.newValue,
    });
  } catch (e) {
    usePostsStore.setState((state) => {
      state.posts.get(postKey).post.my_vote = newValues.oldValue;
    });

    handleLemmyError(e.toString());
  }
};

export default setPostVote;

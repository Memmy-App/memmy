import { IDetermineValue } from "../../../helpers/VoteHelper";
import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setFeedVote = async (
  feedKey: string,
  postId: number,
  newValues: IDetermineValue
) => {
  useFeedsStore.setState((state) => {
    const prev = state.feeds.get(feedKey);
    const prevPost = prev.posts.find((p) => p.post.id === postId);

    prevPost.my_vote = newValues.newValue;
    prevPost.counts.upvotes = newValues.upvotes;
    prevPost.counts.downvotes = newValues.downvotes;
    prevPost.counts.score = newValues.upvotes - newValues.downvotes;
  });

  try {
    await lemmyInstance.likePost({
      auth: lemmyAuthToken,
      post_id: postId,
      score: newValues.newValue,
    });
  } catch (e) {
    useFeedsStore.setState((state) => {
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).my_vote =
        newValues.oldValue;

      handleLemmyError(e.toString());
    });
  }
};

export default setFeedVote;

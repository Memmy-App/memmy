import { produce } from "immer";
import { PostsState, usePostsStore } from "../postsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";
import { IDetermineValue } from "../../../helpers/VoteHelper";

const setPostVote = async (
  postKey: string,
  postId: number,
  newValues: IDetermineValue
) => {
  usePostsStore.setState(
    produce((state: PostsState) => {
      state.posts[postKey].post.my_vote = newValues.newValue;
      state.posts[postKey].post.counts.upvotes = newValues.upvotes;
      state.posts[postKey].post.counts.downvotes = newValues.downvotes;
    })
  );

  try {
    await lemmyInstance.likePost({
      auth: lemmyAuthToken,
      post_id: postId,
      score: newValues.newValue,
    });
  } catch (e) {
    usePostsStore.setState(
      produce((state: PostsState) => {
        state.posts[postKey].post.my_vote = newValues.oldValue;
      })
    );

    handleLemmyError(e.toString());
  }
};

export default setPostVote;

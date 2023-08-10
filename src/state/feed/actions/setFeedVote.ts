import { IDetermineValue } from "@src/helpers/voting";
import { useFeedStore } from "@src/state/feed/feedStore";
import instance from "@src/Instance";

export const setFeedVote = async (
  feedKey: string,
  postId: number,
  newValues: IDetermineValue
): Promise<void> => {
  useFeedStore.setState((state) => {
    const prev = state.feeds.get(feedKey)!;
    const prevPost = prev.posts.find((p) => p.post.id === postId);

    if (!prevPost) return;

    prevPost.my_vote = newValues.newValue;
    prevPost.counts.upvotes = newValues.upvotes;
    prevPost.counts.downvotes = newValues.downvotes;
    prevPost.counts.score = newValues.upvotes - newValues.downvotes;
  });

  try {
    await instance.likePost(postId, newValues.newValue);
  } catch (e) {
    useFeedStore.setState((state) => {
      state.feeds
        .get(feedKey)!
        .posts.find((p) => p.post.id === postId)!.my_vote = newValues.oldValue;
    });
  }
};

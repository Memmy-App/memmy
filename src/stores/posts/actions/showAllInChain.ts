import { usePostsStore } from "@src/stores/posts/postsStore";

const showAllInChain = (
  postKey: string,
  commentId: number,
  type: "top" | "children"
) => {
  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey).commentsState;

    if (type === "top") {
      prev.comments = prev.comments.map((c) => {
        if (
          c.comment.comment.path.includes(commentId.toString()) &&
          c.startedHiddenTop &&
          c.hidden
        ) {
          c.hidden = false;
          return c;
        }

        return c;
      });
    } else {
      prev.comments = prev.comments.map((c) => {
        if (
          c.comment.comment.path.includes(commentId.toString()) &&
          c.startedHiddenChildren &&
          c.hidden
        ) {
          c.hidden = false;
          return c;
        }

        return c;
      });
    }

    state.posts.get(postKey).rerenderComments =
      !state.posts.get(postKey).rerenderComments;
  });
};

export default showAllInChain;

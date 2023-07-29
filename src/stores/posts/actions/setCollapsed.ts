import { usePostsStore } from "@src/stores/posts/postsStore";

const setCollapsed = (postKey: string, commentId: number) => {
  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey);
    const prevComment = prev.commentsState.comments.find(
      (c) => c.comment.comment.id === commentId
    );
    prevComment.collapsed = !prevComment.collapsed;
    prev.rerenderComments = !prev.rerenderComments;

    const prevToHide = prev.commentsState.comments.filter(
      (c) =>
        c.comment.comment.path.includes(prevComment.comment.comment.path) &&
        c.comment.comment.id !== commentId
    );

    if (!prevComment.collapsed) {
      prevToHide.forEach((c) => {
        const shouldUnhide =
          prevToHide.findIndex(
            (cc) =>
              cc.collapsed &&
              c.comment.comment.path.includes(cc.comment.comment.path) &&
              c.comment.comment.id !== cc.comment.comment.id
          ) === -1;

        if (shouldUnhide) {
          c.hidden = false;
        }
      });
    } else {
      prevToHide.forEach((c) => {
        c.hidden = true;
      });
    }
  });
};

export default setCollapsed;

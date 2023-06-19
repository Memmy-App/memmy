import { NestedComment } from "../components/hooks/post/postHooks";

const findAndAddComment = (
  chain: NestedComment[],
  newComment: NestedComment,
  depth = 1
): NestedComment[] => {
  const pathArr = newComment.comment.comment.path.split(".");

  for (const comment of chain) {
    if (comment.comment.comment.path.includes(pathArr[depth])) {
      if (
        comment.comment.comment.id.toString() === pathArr[pathArr.length - 2]
      ) {
        comment.replies.unshift(newComment);
      } else {
        comment.replies = findAndAddComment(
          comment.replies,
          newComment,
          depth + 1
        );
      }

      break;
    }
  }

  return chain;
};

export default findAndAddComment;

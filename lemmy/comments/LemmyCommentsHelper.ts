import { CommentView } from "lemmy-js-client";
import NestedComment from "./NestedComment";

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

const findAndReplaceComment = (
  chain: NestedComment[],
  newText: string,
  commentPath: string,
  depth = 1
): NestedComment[] => {
  const pathArr = commentPath.split(".");

  for (let comment of chain) {
    if (comment.comment.comment.path.includes(pathArr[depth])) {
      if (comment.comment.comment.id.toString() === pathArr[pathArr.length]) {
        comment = {
          ...comment,
          comment: {
            ...comment.comment,
            comment: {
              ...comment.comment.comment,
              content: "Comment deleted by user :(",
            },
          },
        };
      } else {
        comment.replies = findAndReplaceComment(
          comment.replies,
          newText,
          commentPath,
          depth + 1
        );
      }

      break;
    }
  }

  return chain;
};

function buildComments(comments: CommentView[]): NestedComment[] {
  const nestedComments = [];

  const commentDict = {};

  for (const comment of comments) {
    const { path } = comment.comment;
    const pathIds = path.split(".").map(Number);
    const parentId = pathIds[pathIds.length - 2];

    const currentComment = {
      comment,
      replies: [],
    };

    commentDict[comment.comment.id] = currentComment;

    if (parentId !== 0) {
      const parentComment = commentDict[parentId];

      try {
        parentComment.replies.push(currentComment);
      } catch (e) {
        // TODO Handle
      }
    } else {
      nestedComments.push(currentComment);
    }
  }

  return nestedComments;
}

export { findAndAddComment, findAndReplaceComment, buildComments };

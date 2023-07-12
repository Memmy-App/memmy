import { CommentView } from "lemmy-js-client";
import i18n from "../plugins/i18n/i18n";
import NestedComment from "../types/lemmy/NestedComment";

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
              content: i18n.t("commentDeletedByUser"),
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

  // Prepopulate the dictionary
  for (const comment of comments) {
    commentDict[comment.comment.id] = {
      replies: [],
    };
  }

  for (const comment of comments) {
    const { path } = comment.comment;
    const pathIds = path.split(".").map(Number);
    const parentId = pathIds[pathIds.length - 2];

    const currentComment = {
      comment,
      replies: commentDict[comment.comment.id]
        ? commentDict[comment.comment.id].replies
        : [],
    };

    commentDict[comment.comment.id] = currentComment;

    if (parentId !== 0) {
      const parentComment = commentDict[parentId];

      try {
        parentComment.replies.push(currentComment);
      } catch (e) {
        // ParentId isnt in the comment response, so must be the root comment
        nestedComments.push(currentComment);
      }
    } else {
      nestedComments.push(currentComment);
    }
  }

  return nestedComments;
}

export { findAndAddComment, findAndReplaceComment, buildComments };

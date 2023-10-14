import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Common/Comment/CommentChain';
import React from 'react';

export const createCommentReplyComponents = (
  commentsInfo: ICommentInfo[],
): JSX.Element[] => {
  let current = 1;

  const commentReplyComponents: JSX.Element[] = [];

  for (const commentInfo of commentsInfo) {
    commentReplyComponents.push(
      React.createElement(CommentChain, {
        commentInfo,
      }),
    );

    if (
      (commentInfo.depth === 0 && current === 3) ||
      (commentInfo.depth > 0 && current === 2)
    )
      break;
    current++;
  }

  return commentReplyComponents;
};

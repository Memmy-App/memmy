import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Common/Comment/CommentChain';
import React from 'react';

export const createCommentReplyComponents = (
  commentsInfo: ICommentInfo[],
): JSX.Element[] => {
  const commentReplyComponents: JSX.Element[] = [];

  for (const commentInfo of commentsInfo) {
    commentReplyComponents.push(
      React.createElement(CommentChain, {
        commentInfo,
      }),
    );
  }

  return commentReplyComponents;
};

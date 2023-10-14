import React from 'react';
import { useCommentContent } from '@src/state/comment/commentStore';
import Markdown from '@components/Common/Markdown/Markdown';

interface IProps {
  itemId: number;
}

function CommentContent({ itemId }: IProps): React.JSX.Element {
  const content = useCommentContent(itemId);

  return <Markdown>{content}</Markdown>;
}

export default React.memo(CommentContent);

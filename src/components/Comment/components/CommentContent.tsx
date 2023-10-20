import React from 'react';
import {
  useCommentContent,
  useCommentDeleted,
  useCommentRemoved,
} from '@src/state';
import Markdown from '@components/Common/Markdown/Markdown';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function CommentContent({ itemId }: IProps): React.JSX.Element {
  const content = useCommentContent(itemId);
  const removed = useCommentRemoved(itemId);
  const deleted = useCommentDeleted(itemId);

  if (deleted) {
    return (
      <Text color="$secondary" fontSize="$3" fontStyle="italic">
        Comment was deleted by the user
      </Text>
    );
  }

  if (removed) {
    return (
      <Text color="$secondary" fontSize="$3" fontStyle="italic">
        Comment was removed by a moderator
      </Text>
    );
  }

  return <Markdown>{content}</Markdown>;
}

export default React.memo(CommentContent);

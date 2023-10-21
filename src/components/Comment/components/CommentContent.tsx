import React from 'react';
import Markdown from '@components/Common/Markdown/Markdown';
import { Text } from 'tamagui';

interface IProps {
  content: string | undefined;
  removed: boolean;
  deleted: boolean;
}

function CommentContent({
  content,
  removed,
  deleted,
}: IProps): React.JSX.Element {
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

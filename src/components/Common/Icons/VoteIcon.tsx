import React from 'react';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';

interface IProps {
  myVote: number | undefined;
  type: 'up' | 'down';
}

function VoteIcon({ myVote, type }: IProps): React.JSX.Element {
  if (type === 'up') {
    if (myVote === 1) {
      return <ArrowUp color="$upvote" size={15} />;
    } else {
      return <ArrowUp color="$secondary" size={15} />;
    }
  } else if (type === 'down') {
    if (myVote === -1) {
      return <ArrowDown color="$downvote" size={15} />;
    } else {
      return <ArrowDown color="$secondary" size={15} />;
    }
  }

  return <ArrowUp color="$secondary" size={15} />;
}

export default React.memo(VoteIcon);

import React from 'react';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';

interface IProps {
  myVote: number | undefined;
}

function ScoreIcon({ myVote }: IProps): React.JSX.Element {
  if (myVote === -1) {
    return <ArrowDown color="$downvote" size={15} />;
  } else if (myVote === 1) {
    return <ArrowUp color="$upvote" size={15} />;
  } else {
    return <ArrowUp color="$secondary" size={15} />;
  }
}

export default React.memo(ScoreIcon);

import { useMemo } from 'react';
import { replySwipeableActions } from '@helpers/swipeableActions';
import { IPostGestureOption } from '@src/types';
import {
  ISwipeableColors,
  ISwipeableIcons,
  ISwipeableOptions,
} from '@components/Common/SwipeableRow/types';
import { useTheme } from 'tamagui';

export const useInboxReplySwipeOptions = (
  side: 'right' | 'left',
): ISwipeableOptions => {
  const theme = useTheme();

  const swipeColorOptions = useMemo<Record<IPostGestureOption, string>>(
    () => ({
      upvote: theme.upvote.val,
      downvote: theme.downvote.val,
      reply: theme.accent.val,
      read: theme.warn.val,
    }),
    [theme],
  );

  // TODO type this
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const swipeActions = () => {
    const first = side === 'left' ? 'upvote' : 'read';
    const second = side === 'left' ? 'downvote' : 'reply';

    return {
      first: replySwipeableActions[first],
      second: replySwipeableActions[second],
    };
  };

  const swipeColors = useMemo<ISwipeableColors>(() => {
    const first = side === 'left' ? 'upvote' : 'read';
    const second = side === 'left' ? 'downvote' : 'reply';

    return {
      first: swipeColorOptions[first],
      second: swipeColorOptions[second],
    };
  }, [swipeColorOptions]);

  const swipeIcons = useMemo<ISwipeableIcons>(() => {
    const first = side === 'left' ? 'upvote' : 'read';
    const second = side === 'left' ? 'downvote' : 'reply';

    return {
      first,
      second,
    };
  }, []);

  return {
    actions: swipeActions(),
    colors: swipeColors,
    icons: swipeIcons,
  };
};

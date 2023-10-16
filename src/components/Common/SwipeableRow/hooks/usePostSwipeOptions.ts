import { useTheme } from 'tamagui';
import { useMemo } from 'react';
import {
  usePostGesturesFirstLeft,
  usePostGesturesFirstRight,
  usePostGesturesSecondLeft,
  usePostGesturesSecondRight,
} from '@src/state/settings/settingsStore';
import { postSwipeableActions } from '@helpers/swipeableActions';
import { IPostGestureOption } from '@src/types';
import {
  ISwipeableColors,
  ISwipeableIcons,
  ISwipeableOptions,
} from '@components/Common/SwipeableRow/types';

export const usePostSwipeOptions = (
  side: 'right' | 'left',
): ISwipeableOptions => {
  const theme = useTheme();

  const firstLeft = usePostGesturesFirstLeft();
  const firstRight = usePostGesturesFirstRight();
  const secondLeft = usePostGesturesSecondLeft();
  const secondRight = usePostGesturesSecondRight();

  const swipeColorOptions = useMemo<Record<IPostGestureOption, string>>(
    () => ({
      upvote: theme.upvote.val,
      downvote: theme.downvote.val,
      save: theme.bookmark.val,
      hide: theme.warn.val,
      reply: theme.accent.val,
    }),
    [theme],
  );

  // TODO type this
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const swipeActions = () => {
    const first = side === 'left' ? firstLeft : firstRight;
    const second = side === 'left' ? secondLeft : secondRight;

    return {
      first: first !== 'none' ? postSwipeableActions[first] : undefined,
      second: second !== 'none' ? postSwipeableActions[second] : undefined,
    };
  };

  const swipeColors = useMemo<ISwipeableColors>(() => {
    const first = side === 'left' ? firstLeft : firstRight;
    const second = side === 'left' ? secondLeft : secondRight;

    return {
      first:
        first !== 'none' ? swipeColorOptions[first] ?? '$accent' : '$accent',
      second:
        second !== 'none' ? swipeColorOptions[second] ?? undefined : undefined,
    };
  }, [firstLeft, firstRight, secondLeft, secondRight, swipeColorOptions]);

  // @ts-expect-error TODO Fix this
  const swipeIcons = useMemo<ISwipeableIcons>(() => {
    const first = side === 'left' ? firstLeft : firstRight;
    const second = side === 'left' ? secondLeft : secondRight;

    return {
      first: first !== 'none' ? first : undefined,
      second: second !== 'none' ? second : undefined,
    };
  }, [firstLeft, firstRight, secondLeft, secondRight]);

  return {
    actions: swipeActions(),
    colors: swipeColors,
    icons: swipeIcons,
  };
};

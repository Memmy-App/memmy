import { useTheme } from 'tamagui';
import { useMemo } from 'react';
import {
  usePostGesturesFirstLeft,
  usePostGesturesFirstRight,
  usePostGesturesSecondLeft,
  usePostGesturesSecondRight,
} from '@src/state/settings/settingsStore';
import {
  postSwipeableActions,
  SwipeableActionParams,
} from '@components/Common/SwipeableRow/actions';
import { IPostGestureOption } from '@src/types';
import { ISwipeableColors } from '@components/Common/SwipeableRow/types';
import { IconType } from '@src/types/IconMap';

export interface UseSwipeOptions {
  actions: ISwipeableActions;
  colors: ISwipeableColors;
  icons: ISwipeableIcons;
}

interface ISwipeableActions {
  first?: (params: SwipeableActionParams) => unknown;
  second?: (params: SwipeableActionParams) => unknown;
}

interface ISwipeableIcons {
  first?: IconType;
  second?: IconType;
}

export const useSwipeOptions = (
  type: 'post' | 'comment',
  side: 'right' | 'left',
): UseSwipeOptions => {
  const theme = useTheme();

  const firstLeftPost = usePostGesturesFirstLeft();
  const firstRightPost = usePostGesturesFirstRight();
  const secondLeftPost = usePostGesturesSecondLeft();
  const secondRightPost = usePostGesturesSecondRight();

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

  const swipeActions = useMemo<ISwipeableActions>(() => {
    const first = side === 'left' ? firstLeftPost : firstRightPost;
    const second = side === 'left' ? secondLeftPost : secondRightPost;

    return {
      first: first !== 'none' ? postSwipeableActions[first] : undefined,
      second: second !== 'none' ? postSwipeableActions[second] : undefined,
    };
  }, [firstLeftPost, firstRightPost, secondLeftPost, secondRightPost]);

  const swipeColors = useMemo<ISwipeableColors>(() => {
    const first = side === 'left' ? firstLeftPost : firstRightPost;
    const second = side === 'left' ? secondLeftPost : secondRightPost;

    return {
      first:
        first !== 'none' ? swipeColorOptions[first] ?? '$accent' : '$accent',
      second:
        second !== 'none' ? swipeColorOptions[second] ?? undefined : undefined,
    };
  }, [
    firstLeftPost,
    firstRightPost,
    secondLeftPost,
    secondRightPost,
    swipeColorOptions,
  ]);

  // @ts-expect-error TODO Fix this
  const swipeIcons = useMemo<ISwipeableIcons>(() => {
    const first = side === 'left' ? firstLeftPost : firstRightPost;
    const second = side === 'left' ? secondLeftPost : secondRightPost;

    return {
      first: first !== 'none' ? first : undefined,
      second: second !== 'none' ? second : undefined,
    };
  }, [firstLeftPost, firstRightPost, secondLeftPost, secondRightPost]);

  return {
    actions: swipeActions,
    colors: swipeColors,
    icons: swipeIcons,
  };
};

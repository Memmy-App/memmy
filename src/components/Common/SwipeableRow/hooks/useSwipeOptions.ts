import { useTheme } from 'tamagui';
import { useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import {
  postSwipeableActions,
  SwipeableActionParams,
} from '@components/Common/SwipeableRow/actions';
import { IPostGestureOption } from '@src/types';

interface UseSwipeOptions {
  firstAction?: (params: SwipeableActionParams) => unknown;
  secondAction?: (params: SwipeableActionParams) => unknown;

  firstColor?: string;
  secondColor?: string;
}

export const useSwipeOptions = (
  type: 'post' | 'comment',
  side: 'right' | 'left',
): UseSwipeOptions => {
  const theme = useTheme();

  const settings = useSettingsStore((state) => ({
    firstLeft: state.gestures.post.firstLeft,
    secondLeft: state.gestures.post.secondLeft,
    firstRight: state.gestures.post.firstRight,
    secondRight: state.gestures.post.secondRight,

    enabled: state.gestures.post.enabled,
  }));

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

  console.log(swipeColorOptions);

  const swipeOptions = useMemo<UseSwipeOptions>(
    () => ({
      firstAction: postSwipeableActions[settings.firstLeft],
      secondAction: postSwipeableActions[settings.secondLeft],

      firstColor: '#EE923D',
      secondColor: '#1A84E5',
    }),
    [settings.firstLeft, settings.secondLeft, swipeColorOptions],
  );

  return swipeOptions;
};

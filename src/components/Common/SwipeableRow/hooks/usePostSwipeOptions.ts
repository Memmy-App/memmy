import { useTheme } from 'tamagui';
import { ComponentProps, createElement, useMemo } from 'react';
import {
  usePostGesturesEnabled,
  usePostGesturesFirstLeft,
  usePostGesturesFirstRight,
  usePostGesturesSecondLeft,
  usePostGesturesSecondRight,
} from '@src/state';
import { IconMap, IPostGestureOption } from '@src/types';
import { postSwipeableActions } from '@helpers/swipeableActions';
import { ISwipeableActionGroup } from 'react-native-reanimated-swipeable';

export const usePostSwipeOptions = (
  side: 'right' | 'left',
  actionParams: object,
): ISwipeableActionGroup | null => {
  const theme = useTheme();

  const enabled = usePostGesturesEnabled();

  const firstLeft = usePostGesturesFirstLeft();
  const firstRight = usePostGesturesFirstRight();
  const secondLeft = usePostGesturesSecondLeft();
  const secondRight = usePostGesturesSecondRight();

  const swipeColorOptions = useMemo<Record<IPostGestureOption, string>>(
    () => ({
      upvote: theme.upvote.val,
      downvote: theme.downvote.val,
      save: theme.bookmark.val,
      // hide: theme.warn.val, TODO we will replace this with something else eventually
      reply: theme.accent.val,
      share: theme.opText.val,
    }),
    [theme],
  );

  const actionGroup = useMemo((): ISwipeableActionGroup | null => {
    if (!enabled) return null;

    if (side === 'left') {
      if (firstLeft === 'none') return null;

      return {
        firstStep: {
          icon: () =>
            createElement<ComponentProps<any>>(IconMap[firstLeft], {
              size: 30,
            }),
          backgroundColor: swipeColorOptions[firstLeft],
          actionParamObject: actionParams,
          triggerThreshold: 75,
          onAction: () => postSwipeableActions[firstLeft](actionParams),
        },
        ...(secondLeft != null && {
          secondStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap[secondLeft], {
                size: 30,
              }),
            backgroundColor: swipeColorOptions[secondLeft],
            actionParamObject: actionParams,
            triggerThreshold: 150,
            onAction: () => postSwipeableActions[secondLeft](actionParams),
          },
        }),
      };
    } else {
      if (firstRight === 'none') return null;

      return {
        firstStep: {
          icon: () =>
            createElement<ComponentProps<any>>(IconMap[firstRight], {
              size: 30,
            }),
          backgroundColor: swipeColorOptions[firstRight],
          actionParamObject: actionParams,
          triggerThreshold: 75,
          onAction: () => postSwipeableActions[firstRight](actionParams),
        },
        ...(secondLeft != null && {
          secondStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap[secondRight], {
                size: 30,
              }),
            backgroundColor: swipeColorOptions[secondRight],
            actionParamObject: actionParams,
            triggerThreshold: 150,
            onAction: () => postSwipeableActions[secondRight](actionParams),
          },
        }),
      };
    }
  }, [
    enabled,
    firstLeft,
    secondLeft,
    firstRight,
    secondRight,
    swipeColorOptions,
    actionParams,
  ]);

  return actionGroup;
};

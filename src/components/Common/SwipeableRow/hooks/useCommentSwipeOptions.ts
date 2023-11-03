import { ComponentProps, createElement, useMemo } from 'react';
import {
  useCommentGesturesEnabled,
  useCommentGesturesFirstLeft,
  useCommentGesturesFirstRight,
  useCommentGesturesSecondLeft,
  useCommentGesturesSecondRight,
} from '@src/state';
import { commentSwipeableActions } from '@helpers/swipeableActions';
import { IconMap, IPostGestureOption } from '@src/types';
import { useTheme } from 'tamagui';
import { ISwipeableActionGroup } from 'react-native-reanimated-swipeable';

export const useCommentSwipeOptions = (
  side: 'right' | 'left',
  actionParams: object,
): ISwipeableActionGroup | null => {
  const theme = useTheme();

  const enabled = useCommentGesturesEnabled();

  const firstLeft = useCommentGesturesFirstLeft();
  const firstRight = useCommentGesturesFirstRight();
  const secondLeft = useCommentGesturesSecondLeft();
  const secondRight = useCommentGesturesSecondRight();

  const swipeColorOptions = useMemo<Record<IPostGestureOption, string>>(
    () => ({
      upvote: theme.upvote.val,
      downvote: theme.downvote.val,
      save: theme.bookmark.val,
      hide: theme.warn.val,
      reply: theme.accent.val,
      collapse: theme.warn.val,
      share: theme.opText.val,
    }),
    [theme],
  );

  const actionGroup: ISwipeableActionGroup | null =
    useMemo((): ISwipeableActionGroup | null => {
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
            onAction: () => commentSwipeableActions[firstLeft](actionParams),
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
              onAction: () => commentSwipeableActions[secondLeft](actionParams),
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
            onAction: () => commentSwipeableActions[firstRight](actionParams),
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
              onAction: () =>
                commentSwipeableActions[secondRight](actionParams),
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

import { ComponentProps, createElement, useMemo } from 'react';
import {
  mentionSwipeableActions,
  replySwipeableActions,
} from '@helpers/swipeableActions';
import { IconMap, IPostGestureOption } from '@src/types';
import { useTheme } from 'tamagui';
import { ISwipeableActionGroup } from 'react-native-reanimated-swipeable';
import { useCommentGesturesEnabled } from '@src/state';

export const useInboxReplySwipeOptions = (
  side: 'right' | 'left',
  type: 'reply' | 'mention',
  actionParams: object,
): ISwipeableActionGroup | null => {
  const theme = useTheme();

  const enabled = useCommentGesturesEnabled();

  const swipeColorOptions = useMemo<Record<IPostGestureOption, string>>(
    () => ({
      upvote: theme.upvote.val,
      downvote: theme.downvote.val,
      reply: theme.accent.val,
      read: theme.warn.val,
    }),
    [theme],
  );

  const actionGroup: ISwipeableActionGroup | null =
    useMemo((): ISwipeableActionGroup | null => {
      if (!enabled) return null;

      if (side === 'left') {
        return {
          firstStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap.upvote, {
                size: 30,
              }),
            backgroundColor: swipeColorOptions.upvote,
            actionParamObject: actionParams,
            triggerThreshold: 75,
            onAction: () =>
              type === 'reply'
                ? replySwipeableActions.upvote(actionParams)
                : mentionSwipeableActions.upvote(actionParams),
          },
          secondStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap.downvote, {
                size: 30,
              }),
            backgroundColor: swipeColorOptions.upvote,
            actionParamObject: actionParams,
            triggerThreshold: 150,
            onAction: () =>
              type === 'reply'
                ? replySwipeableActions.downvote(actionParams)
                : mentionSwipeableActions.downvote(actionParams),
          },
        };
      } else {
        return {
          firstStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap.read, {
                size: 30,
              }),
            backgroundColor: swipeColorOptions.read,
            actionParamObject: actionParams,
            triggerThreshold: 75,
            onAction: () =>
              type === 'reply'
                ? replySwipeableActions.read(actionParams)
                : mentionSwipeableActions.read(actionParams),
          },
          secondStep: {
            icon: () =>
              createElement<ComponentProps<any>>(IconMap.reply, {
                size: 30,
              }),
            backgroundColor: swipeColorOptions.reply,
            actionParamObject: actionParams,
            triggerThreshold: 150,
            onAction: () =>
              type === 'reply'
                ? replySwipeableActions.reply(actionParams)
                : mentionSwipeableActions.reply(actionParams),
          },
        };
      }
    }, [enabled, swipeColorOptions, actionParams]);

  return actionGroup;
};

import { IGestureCommentSettings, useSettingsStore } from '@src/state';
import { ICommentGestureOption } from '@src/types';

export const setCommentGestureSetting = <
  T extends keyof IGestureCommentSettings,
>(
  setting: T,
  value: ICommentGestureOption | boolean | 'none',
): void => {
  useSettingsStore.setState((state) => {
    // @ts-expect-error -- T is a key of SettingsStore
    state.gestures.comment[setting] = value;
  });
};

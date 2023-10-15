import {
  IGesturePostSettings,
  useSettingsStore,
} from '@src/state/settings/settingsStore';
import { IPostGestureOption } from '@src/types';

export const setPostGestureSetting = <T extends keyof IGesturePostSettings>(
  setting: T,
  value: IPostGestureOption | boolean | 'none',
): void => {
  useSettingsStore.setState((state) => {
    // @ts-expect-error -- T is a key of SettingsStore
    state.gestures.post[setting] = value;
  });
};

import { SettingsStore, useSettingsStore } from '@src/state';

export const setSetting = <T extends keyof SettingsStore>(
  setting: T,
  value: string | boolean | number | object[] | object,
): void => {
  useSettingsStore.setState((state) => {
    // @ts-expect-error -- T is a key of SettingsStore
    state[setting] = value;
  });
};

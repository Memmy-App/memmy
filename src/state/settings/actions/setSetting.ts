import { useSettingsStore } from "@src/state/settings/settingsStore";

export const setSetting = (
  key: string,
  value: string | boolean | number | object[] | object
): void => {
  useSettingsStore.setState((state) => {
    // @ts-ignore
    state[key] = value;
  });
};

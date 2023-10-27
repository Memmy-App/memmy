import { useSettingsStore } from '@src/state';
import { getBaseUrl } from '@helpers/links';

export const createName = (
  partOne?: string,
  partTwo?: string,
  ignoreSettings = false,
): string => {
  const hideFullUsername = useSettingsStore.getState().hideInstanceForUsernames;

  if (partOne == null || partTwo == null) return '';

  partTwo = getBaseUrl(partTwo);

  if (hideFullUsername && !ignoreSettings) {
    return partOne;
  }

  return `${partOne}@${partTwo}`;
};

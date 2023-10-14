import { useSettingsStore } from '@src/state/settings/settingsStore';
import { getBaseUrl } from '@helpers/links';

export const createName = (
  partOne?: string,
  partTwo?: string,
  ignoreSettings = false,
): string => {
  const showFullName = useSettingsStore.getState().showInstanceForUsernames;

  if (partOne == null || partTwo == null) return '';

  partTwo = getBaseUrl(partTwo);

  if (!showFullName && !ignoreSettings) {
    return partOne;
  }

  return `${partOne}@${partTwo}`;
};

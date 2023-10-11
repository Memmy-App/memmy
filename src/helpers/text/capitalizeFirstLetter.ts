import { addSpaceBeforeCapital } from '@helpers/text/addSpaceBeforeCapital';

export const capitalizeFirstLetter = (
  str: string | null,
  addSpace: false,
): string => {
  if (str == null) {
    return '';
  }

  let s = str;

  if (addSpace) {
    s = addSpaceBeforeCapital(s);
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};

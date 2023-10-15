import { addSpaceBeforeCapital } from '@helpers/text/addSpaceBeforeCapital';

export const capitalizeFirstLetter = (
  str: string | undefined,
  addSpace = false,
): string | undefined => {
  if (str == null) {
    return undefined;
  }

  let s = str;

  if (addSpace) {
    s = addSpaceBeforeCapital(s);
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};

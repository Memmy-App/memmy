export const addSpaceBeforeCapital = (str?: string): string => {
  if (str == null) {
    return '';
  }

  return str.replace(/([A-Z])/g, ' $1').trim();
};

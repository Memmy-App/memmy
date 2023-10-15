export const stripEss = (
  count: number | undefined,
  text: string | undefined,
): string => {
  if (count == null || text == null) {
    return '';
  }

  if (count === 1) {
    return text.substring(0, text.length - 2);
  }

  return text;
};

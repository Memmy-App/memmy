export const truncateText = (
  text: string | undefined,
  length: number,
): string | undefined => {
  if (text == null) {
    return undefined;
  }

  if (text.length > length) {
    return text.slice(0, length) + '...';
  }

  return text;
};

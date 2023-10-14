export const createFullName = (partOne?: string, partTwo?: string): string => {
  if (partOne == null || partTwo == null) return '';

  return `${partOne}@${partTwo}`;
};

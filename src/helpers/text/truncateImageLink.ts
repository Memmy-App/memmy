export const truncateImageLink = (link: string): string => {
  if (link.length <= 36) return link;

  return `${link.slice(0, 24)}...`;
};

export const truncateLink = (link: string): string => {
  if (!link) return "";

  if (link.length <= 36) return link;

  return `${link.slice(0, 36)}...`;
};

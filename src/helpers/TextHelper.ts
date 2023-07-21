export const truncateName = (name: string, truncLength = 16): string => {
  if (name.length <= truncLength) return name;

  return `${name?.slice(0, truncLength)}...`;
};

export const truncateLink = (link: string): string => {
  if (link.length <= 36) return link;

  return `${link?.slice(0, 36)}...`;
};

export const truncateImageLink = (link: string): string => {
  if (link.length <= 36) return link;

  return `${link.slice(0, 24)}...`;
};

export const truncatePost = (post: string, truncLength = 500): string => {
  if (!post) return "";

  if (post.length <= truncLength) return post;
  // regex removes extra white spaces and new lines
  return `${post?.slice(0, truncLength)}...`.replace(/\s\s+/g, " ");
};

export const truncateCompactFeedItem = (text: string): string => {
  if (!text) return "";

  if (text?.length <= 60) return text;

  return `${text?.slice(0, 60)}...`;
};

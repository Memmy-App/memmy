export const getBaseUrl = (link?: string, noSubdomain = false): string => {
  if (link == null) return '';

  if (noSubdomain) {
    const domain = link.replace(/^(https?:\/\/)?(www\.)?/i, '').split('/')[0];
    const parts = domain.split('.').reverse();

    if (parts.length > 2 && parts[1].length <= 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    return `${parts[1]}.${parts[0]}`;
  }
  const regex = /^(?:https?:\/\/)?([^/]+)/;
  const match = link.match(regex);

  if (match != null && match.length >= 2) {
    return match[1];
  }

  return '';
};

import { LinkType } from '@src/types';

export const getLinkType = (link?: string): LinkType => {
  if (link == null) {
    return 'none';
  }

  const extension = link.split('.').pop()?.toLowerCase();

  if (extension == null) {
    return 'generic';
  }

  if (imageExtensions.includes(extension)) {
    return 'image';
  }

  return 'generic';
};

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

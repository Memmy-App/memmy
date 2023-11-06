import { getLinkType } from '@helpers/links/getLinkType';
import { Image } from 'expo-image';

export const cacheImages = async (links: string[]): Promise<void> => {
  const imageLinks: string[] = [];

  for (const link of links) {
    if (getLinkType(link) === 'image') {
      imageLinks.push(link);
    }
  }

  Image.prefetch(imageLinks);
};

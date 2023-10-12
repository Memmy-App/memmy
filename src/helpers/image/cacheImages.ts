import { getLinkType } from '@helpers/links/getLinkType';
import { Image } from 'expo-image';
import { PostView } from 'lemmy-js-client';

export const cacheImages = async (links: string[]): Promise<void> => {
  const imageLinks: string[] = [];

  for (const link of links) {
    if (getLinkType(link) === 'image') {
      console.log('Caching ', link);

      imageLinks.push(link);
    }
  }

  Image.prefetch(imageLinks);
};

export const cacheImagesFromPosts = async (
  posts: PostView[],
): Promise<void> => {
  const imageLinks: string[] = [];

  for (const post of posts) {
    if (post.post.url != null && getLinkType(post.post.url) === 'image') {
      imageLinks.push(post.post.url);
    }
  }

  Image.prefetch(imageLinks);
};

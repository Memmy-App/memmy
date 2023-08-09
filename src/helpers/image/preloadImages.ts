import { PostView } from "lemmy-js-client";
import { ExtensionType, getLinkInfo } from "@src/helpers/links";
import FastImage from "@gkasdorf/react-native-fast-image";

export const preloadImages = async (posts: PostView[]): Promise<void> => {
  const images = [];
  let current = 0;

  for (const post of posts) {
    const info = getLinkInfo(post.post.url);

    if (info.extType === ExtensionType.IMAGE) {
      images.push({
        uri: post.post.url,
        priority:
          current < 4
            ? FastImage.priority.high
            : current < 10
            ? FastImage.priority.normal
            : FastImage.priority.low,
      });
      current += 1;
    } else if (
      (info.extType === ExtensionType.VIDEO ||
        info.extType === ExtensionType.GENERIC) &&
      post.post.thumbnail_url
    ) {
      images.push({
        uri: post.post.thumbnail_url,
      });
    }
  }

  FastImage.preload(images);
};

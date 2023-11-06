import RNShare, { ShareOptions } from 'react-native-share';
import { setToast } from '@src/state';
import { Image } from 'expo-image';

interface ShareLinkOptions {
  title?: string;
  link: string;
  isImage?: boolean;
  callback?: () => unknown;
}

export const shareLink = async ({
  title,
  link,
  isImage,
  callback,
}: ShareLinkOptions): Promise<void> => {
  let options: ShareOptions = {
    url: link,
    title,
  };

  if (isImage === true) {
    const uri = await Image.getCachePathAsync(link);

    if (uri == null) return;

    options = {
      filename: uri.split('/').pop(),
      type: `image/${uri.split('.').pop()}`,
      activityItemSources: [
        {
          placeholderItem: { type: 'url', content: 'url' },
          item: {
            default: {
              type: 'url',
              content: uri,
            },
          },
          dataTypeIdentifier: {
            saveToCameraRoll: `image/${uri.split('.').pop()}`,
          },
        },
      ],
    };
  }

  try {
    void RNShare.open(options).then(() => callback?.());
  } catch (e: any) {
    setToast({
      text: 'Error sharing content.',
    });
  }
};

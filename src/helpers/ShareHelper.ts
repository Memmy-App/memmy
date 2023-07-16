import Share, { ShareOptions } from "react-native-share";
import FastImage from "@gkasdorf/react-native-fast-image";
import { onGenericHapticFeedback } from "./HapticFeedbackHelpers";

interface ShareLinkOptions {
  title?: string;
  link: string;
  isImage?: boolean;
  callback?: () => unknown;
}

// eslint-disable-next-line import/prefer-default-export
export const shareLink = async ({
  title,
  link,
  isImage = false,
  callback,
}: ShareLinkOptions) => {
  onGenericHapticFeedback();

  let options: ShareOptions = {
    url: link,
    title,
  };

  if (isImage) {
    const uri = await FastImage.getCachePath({ uri: link });

    options = {
      filename: uri.split("/").pop(),
      type: `image/${uri.split(".").pop()}`,
      activityItemSources: [
        {
          placeholderItem: { type: "url", content: "url" },
          item: {
            default: { type: "url", content: uri },
          },
          dataTypeIdentifier: {
            saveToCameraRoll: `image/${uri.split(".").pop()}`,
          },
        },
      ],
    };
  }

  const after = () => {
    if (callback) callback();
  };

  try {
    Share.open(options).then(() => after());
  } catch {
    /* empty */
  }
};

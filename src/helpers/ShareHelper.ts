import Share, { ShareOptions } from "react-native-share";
import { Alert } from "react-native";
import { downloadImage } from "./ImageHelper";
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
    const res = await downloadImage(link);

    if (!res) {
      Alert.alert("Failed to save image.");
      return;
    }

    const uri = res as string;

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

  try {
    Share.open(options).then(() => callback && callback());
  } catch {
    /* empty */
  }
};

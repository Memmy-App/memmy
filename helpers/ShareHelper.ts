import { Share } from "react-native";

interface ShareLinkOptions {
  title: string;
  link: string;
}

// eslint-disable-next-line import/prefer-default-export
export const shareLink = ({ title, link }: ShareLinkOptions) => {
  try {
    Share.share({
      url: link,
      title,
    }).then();
  } catch {
    /* empty */
  }
};

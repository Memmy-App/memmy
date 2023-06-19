import * as WebBrowser from "expo-web-browser";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const imageExtensions = [
  "webp",
  "png",
  "avif",
  "heic",
  "jpeg",
  "jpg",
  "gif",
  "svg",
  "ico",
  "icns",
];

const videoExtensions = ["mp4", "mov", "m4a"];

export interface LinkInfo {
  extType?: ExtensionType;
  link?: string;
}

export enum ExtensionType {
  NONE = 0,
  IMAGE = 1,
  VIDEO = 2,
  GENERIC = 3,
}

export const getLinkInfo = (link?: string): LinkInfo => {
  let type;

  if (!link) {
    type = ExtensionType.NONE;
  } else {
    const extension = link.split(".").pop();

    if (imageExtensions.includes(extension)) {
      type = ExtensionType.IMAGE;
    } else if (videoExtensions.includes(extension)) {
      type = ExtensionType.VIDEO;
    } else {
      type = ExtensionType.GENERIC;
    }
  }

  return {
    link,
    extType: type,
  };
};

export const openLink = async (
  link: string,
  navigation: NativeStackNavigationProp<any, string, undefined>
): Promise<WebBrowser.WebBrowserResult | void> => {
  const pattern = /https:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+\/[cm]\/[A-Za-z]+/;
  const isFed = link.match(pattern);

  if (isFed) {
    const communityOnEnd = link.split("@").pop();

    let baseUrl;
    let community;

    if (communityOnEnd) {
      baseUrl = communityOnEnd;
      community = link.split("c/").pop().split("@")[0];
    } else {
      baseUrl = getBaseUrl(link);
      community = link.split("/").pop();
    }

    navigation.push("Community", {
      communityFullName: `${community}@${baseUrl}`,
      communityName: community,
      actorId: baseUrl,
    });
  } else {
    WebBrowser.openBrowserAsync(link, {
      dismissButtonStyle: "close",
      presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: "#000",
    });
  }
};

export const getBaseUrl = (link: string): string => {
  const regex = /^(?:https?:\/\/)?([^/]+)/;
  return link.match(regex)[1];
};

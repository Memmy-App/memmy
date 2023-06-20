import * as WebBrowser from "expo-web-browser";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { writeToLog } from "./LogHelper";

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

export const openLink = (
  link: string,
  navigation: NativeStackNavigationProp<any, string, undefined>
): void => {
  const urlPattern =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

  let fixedLink = decodeURIComponent(link);
  fixedLink = fixedLink.match(urlPattern)[0];
  fixedLink = fixedLink.replace("%5D", "");

  const fedPattern = /https:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+\/[cm]\/[A-Za-z]+/;
  const isFed = fixedLink.match(fedPattern);

  writeToLog(`Trying to open link: ${fixedLink}`);

  try {
    if (isFed) {
      const communityOnEnd = fixedLink.includes("@");

      let baseUrl;
      let community;

      if (communityOnEnd) {
        baseUrl = fixedLink.split("@").pop();
        community = fixedLink.split("c/").pop().split("@")[0];
      } else {
        baseUrl = getBaseUrl(fixedLink);
        community = fixedLink.split("/").pop();
      }

      navigation.push("Community", {
        communityFullName: `${community}@${baseUrl}`,
        communityName: community,
        actorId: baseUrl,
      });
    } else {
      WebBrowser.openBrowserAsync(fixedLink, {
        dismissButtonStyle: "close",
        presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: "#000",
      }).catch((e) => {
        writeToLog(e.toString());
      });
    }
  } catch (e) {
    writeToLog("Error opening link.");
    writeToLog(e.toString());
    Alert.alert("Error.", e.toString());
  }
};

export const getBaseUrl = (link: string): string => {
  const regex = /^(?:https?:\/\/)?([^/]+)/;
  return link.match(regex)[1];
};

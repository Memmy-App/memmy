import * as WebBrowser from "expo-web-browser";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";

import axios from "axios";
import { URL } from "react-native-url-polyfill";
import { writeToLog } from "./LogHelper";
import store from "../../store";

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
  "gifv",
];

const videoExtensions = ["mp4", "mov", "m4a"];
let { accounts } = store.getState();

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

export const isPotentialFedSite = (link: string) => {
  const fedPattern =
    /^(?:https?:\/\/\w+\.\w+)?\/(?:c|m|u|post)\/\w+(?:@\w+(?:\.\w+)?(?:\.\w+)?)?$/;
  return link.match(fedPattern);
};

export const isLemmySite = async (link: string) => {
  if (!accounts.currentAccount) {
    ({ accounts } = store.getState());
  }

  let instanceUrl = accounts.currentAccount.instance;
  if (
    !instanceUrl.startsWith("https://") &&
    !instanceUrl.startsWith("http://")
  ) {
    instanceUrl = `https://${instanceUrl}`;
  }

  // Handle shortcut links that are formatted: "/c/community@instance". Need to prepend the home instance url
  if (link[0] === "/") {
    if (instanceUrl === "") {
      writeToLog(
        `Trying to open link: ${link} with instanceUrl: ${instanceUrl}`
      );
      return false;
    }
    link = instanceUrl + link;
  }

  let urlComponents;
  try {
    urlComponents = new URL(link);
  } catch (e) {
    writeToLog(
      `Failed to make components from link: ${link}Err: ${e.toString()}`
    );
    return false;
  }

  // Try lemmy api to verify this is a valid lemmy instance
  const apiUrl = `${urlComponents.protocol}//${urlComponents.hostname}/api/v3/site`;
  try {
    const resp = await axios.get(apiUrl);
    return !!resp.data.site_view.site.name;
  } catch (e) {
    return false;
  }
};

const openLemmyLink = (
  link: string,
  navigation: NativeStackNavigationProp<any>
): void => {
  const communityOnEnd = link.includes("@");

  let baseUrl;
  let community;

  if (communityOnEnd) {
    baseUrl = link.split("@").pop();
    community = link
      .split(/\/[cmu]\//)
      .pop()
      .split("@")[0];
  } else {
    baseUrl = getBaseUrl(link);
    community = link.split("/").pop();
  }

  if (link.includes("/u/")) {
    navigation.push("Profile", {
      fullUsername: `${community}@${baseUrl}`,
    });
    // TODO: Handle other type of lemmy links
    // } else if (link.includes("/post/")) {
    //   navigation.push("Post");
  } else if (link.includes("/c/")) {
    navigation.push("Community", {
      communityFullName: `${community}@${baseUrl}`,
      communityName: community,
      actorId: baseUrl,
    });
  } else {
    // In case the link type is not handled, open in a browser
    openWebLink(link);
  }
};

const openWebLink = (link: string): void => {
  const urlPattern =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

  try {
    writeToLog(`Trying to open link: ${link}`);

    let fixedLink = decodeURIComponent(link);
    fixedLink = fixedLink.match(urlPattern)[0];
    fixedLink = fixedLink.replace("%5D", "");

    WebBrowser.openBrowserAsync(fixedLink, {
      dismissButtonStyle: "close",
      presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: "#000",
    })
      .then(() => {
        WebBrowser.dismissBrowser();
      })
      .catch((e) => {
        writeToLog(e.toString());
      });
  } catch (e) {
    writeToLog("Error opening link.");
    writeToLog(e.toString());
    Alert.alert("Error.", e.toString());
  }
};

export const openLink = (
  link: string,
  navigation: NativeStackNavigationProp<any>
): void => {
  link = decodeURIComponent(link);

  const potentialFed = isPotentialFedSite(link);
  if (potentialFed) {
    isLemmySite(link)
      .then((isLemmy) => {
        if (isLemmy) {
          openLemmyLink(link, navigation);
        } else {
          openWebLink(link);
        }
      })
      .catch(() => {
        openWebLink(link);
      });
  } else {
    openWebLink(link);
  }
};

export const getBaseUrl = (link?: string): string => {
  const regex = /^(?:https?:\/\/)?([^/]+)/;
  return link ? link.match(regex)[1] : null;
};

// eslint-disable-next-line import/no-extraneous-dependencies
import * as Permissions from "expo-permissions";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as MediaLibrary from "expo-media-library";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from "expo-image-picker";
import { PostView } from "lemmy-js-client";
import FastImage from "@gkasdorf/react-native-fast-image";
import { Alert, Dimensions } from "react-native";
import i18n from "../plugins/i18n/i18n";
import { writeToLog } from "./LogHelper";
import { ExtensionType, getLinkInfo } from "./LinkHelper";
import { ErrorCause } from "../types/ErrorCause";

export const saveImage = async (src: string): Promise<boolean> => {
  // Get the status of permissions
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  // If we don't have permission, tell the user
  if (status !== "granted") {
    Alert.alert(
      i18n.t("alert.title.permissionsError"),
      i18n.t("alert.message.allowCameraRoll")
    );
    return false;
  }

  // Get the URI of the cached image
  const uri = await FastImage.getCachePath({ uri: src });

  // Save the image
  try {
    await MediaLibrary.createAssetAsync(uri);
  } catch (e) {
    writeToLog("Error saving image.");
    writeToLog(e.toString());
  }

  return true;
};

export const selectImage = async (): Promise<string> => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  if (status === "granted") {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
      allowsMultipleSelection: false,
    });

    if (res.canceled) {
      throw Error("cancelled", { cause: ErrorCause.USER_CANCEL });
    }

    return res.assets[0].uri;
  }
  throw Error("permissions", { cause: ErrorCause.NO_PERMISSION });
};

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

export const getRatio = (
  realHeight: number,
  realWidth: number,
  modifier: number = 0.6
): { imageHeight: number; imageWidth: number } => {
  const screenHeight = Dimensions.get("screen").height * modifier;
  const screenWidth = Dimensions.get("screen").width;

  const heightRatio = screenHeight / realHeight;
  const widthRatio = screenWidth / realWidth;

  const ratio = Math.min(widthRatio, heightRatio);

  const imageHeight = realHeight * ratio;
  const imageWidth = realWidth * ratio;

  return {
    imageHeight,
    imageWidth,
  };
};

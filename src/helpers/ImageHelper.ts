// eslint-disable-next-line import/no-extraneous-dependencies
import * as FileSystem from "expo-file-system";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Permissions from "expo-permissions";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as MediaLibrary from "expo-media-library";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from "expo-image-picker";
import { PostView } from "lemmy-js-client";
import FastImage from "react-native-fast-image";
import { Dimensions } from "react-native";
import { writeToLog } from "./LogHelper";
import { ExtensionType, getLinkInfo } from "./LinkHelper";

export const downloadImage = async (src: string): Promise<string | boolean> => {
  const fileName = src.split("/").pop();
  const filePath = FileSystem.documentDirectory + fileName;

  try {
    const res = await FileSystem.downloadAsync(src, filePath);
    return res.uri;
  } catch (e) {
    writeToLog("Error downloading image.");
    writeToLog(e.toString());
    return false;
  }
};

export const deleteImage = async (uri: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(uri);
    console.log("Image deleted.");
    return true;
  } catch (e) {
    writeToLog("Error deleting file.");
    writeToLog(e.toString());
    return false;
  }
};

const downloadAndSaveImage = async (src: string): Promise<boolean> => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  if (status !== "granted") return false;

  const uri = await downloadImage(src);

  if (!uri) return false;

  await saveImage(uri as string);
  return true;
};

const saveImage = async (filePath: string) => {
  try {
    await MediaLibrary.createAssetAsync(filePath);
  } catch (e) {
    writeToLog("Error saving image.");
    writeToLog(e.toString());
  }
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
      throw Error("cancelled");
    }

    return res.assets[0].uri;
  }
  throw Error("permissions");
};

export const preloadImages = async (posts: PostView[]): Promise<void> => {
  const images = [];

  for (const post of posts) {
    const info = getLinkInfo(post.post.url);

    if (info.extType === ExtensionType.IMAGE) {
      images.push({
        uri: post.post.url,
      });
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

export default downloadAndSaveImage;

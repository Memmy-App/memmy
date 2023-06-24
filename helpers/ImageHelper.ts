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
import { writeToLog } from "./LogHelper";
import { ExtensionType, getLinkInfo } from "./LinkHelper";

const downloadAndSaveImage = async (src: string): Promise<boolean> => {
  const fileName = src.split("/").pop();
  const filePath = FileSystem.documentDirectory + fileName;

  try {
    const { status } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY_WRITE_ONLY
    );

    if (status === "granted") {
      const res = await FileSystem.downloadAsync(src, filePath);
      saveImage(res.uri);
      return true;
    }

    return false;
  } catch (e) {
    writeToLog("Error downloading image.");
    writeToLog(e.toString());
    return false;
  }
};

const saveImage = async (filePath: string) => {
  try {
    MediaLibrary.saveToLibraryAsync(filePath).then();
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

    const localUri = res.assets[0].uri;

    return localUri;
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

export default downloadAndSaveImage;

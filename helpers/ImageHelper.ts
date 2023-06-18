// eslint-disable-next-line import/no-extraneous-dependencies
import * as FileSystem from "expo-file-system";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Permissions from "expo-permissions";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as MediaLibrary from "expo-media-library";

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
    console.log(e);
    return false;
  }
};

const saveImage = async (filePath: string) => {
  try {
    MediaLibrary.saveToLibraryAsync(filePath).then();
  } catch (e) {
    console.log("Error: ", e);
  }
};

export default downloadAndSaveImage;

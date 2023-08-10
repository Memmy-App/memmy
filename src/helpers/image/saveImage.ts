import { Alert } from "react-native";
import i18n from "i18next";
import FastImage from "@gkasdorf/react-native-fast-image";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { writeToLog } from "@src/helpers/debug/DebugHelper";

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
  } catch (e: any) {
    writeToLog("Error saving image.");
    writeToLog(e.toString());
  }

  return true;
};

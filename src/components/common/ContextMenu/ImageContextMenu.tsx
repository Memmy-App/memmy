import { ICON_MAP } from "@root/src/constants/IconMap";
import { onGenericHapticFeedback } from "@root/src/helpers/HapticFeedbackHelpers";
import { saveImage } from "@root/src/helpers/ImageHelper";
import { showToast } from "@root/src/slices/toast/toastSlice";
import { ContextMenuOption } from "@root/src/types/ContextMenuOptions";
import { useAppDispatch } from "@root/store";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { shareLink } from "@root/src/helpers/ShareHelper";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import FastImage from "@gkasdorf/react-native-fast-image";
import { AppContextMenuView } from "./App/AppContextMenuView";

interface IProps extends PropsWithChildren {
  children: React.ReactNode;
  source: string;
}

export function ImageContextMenu({ children, source }: IProps) {
  const dispatch = useAppDispatch();

  const options: ContextMenuOption[] = [
    {
      title: "Share",
      key: "share",
      icon: ICON_MAP.SHARE,
    },
    {
      title: "Save to Photos",
      key: "save",
      icon: ICON_MAP.DOWNLOAD,
    },
    {
      title: "Copy",
      key: "copy",
      icon: ICON_MAP.COPY,
    },
  ];

  const copyToClipboard = async () => {
    try {
      const uri = await FastImage.getCachePath({ uri: source });

      const image = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      await Clipboard.setImageAsync(image);

      dispatch(
        showToast({
          message: "Image copied.",
          duration: 1500,
          variant: "info",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: "Error copying image.",
          duration: 1500,
          variant: "error",
        })
      );
    }
  };

  const onPressMenuItem: OnPressMenuItemEvent = async (event) => {
    onGenericHapticFeedback();
    switch (event.nativeEvent.actionKey) {
      case "share":
        try {
          await shareLink({
            link: source,
            isImage: true,
          });
        } catch (e) {
          /* Empty */
        }
        break;
      case "save":
        await saveImage(source);

        dispatch(
          showToast({
            message: "Image saved.",
            duration: 1500,
            variant: "info",
          })
        );
        break;
      case "copy":
        await copyToClipboard();
        break;
      default:
        break;
    }
  };

  return (
    <AppContextMenuView options={options} onPressMenuItem={onPressMenuItem}>
      {children}
    </AppContextMenuView>
  );
}

import React, { SetStateAction, useState } from "react";
import { Alert, InputAccessoryView, TextInput } from "react-native";
import { HStack, useTheme } from "native-base";
import {
  IconBold,
  IconItalic,
  IconLink,
  IconPhoto,
  IconQuote,
} from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import { selectImage } from "../../helpers/ImageHelper";
import LoadingModal from "./Loading/LoadingModal";
import uploadToImgur from "../../helpers/ImgurHelper";
import { writeToLog } from "../../helpers/LogHelper";
import IconButtonWithText from "./IconButtonWithText";
import { ErrorCause } from "../../types/ErrorCause";

function KeyboardAccessory({
  setText,
  text,
  selection,
  inputRef,
}: {
  setText: React.Dispatch<SetStateAction<string>>;
  text: string;
  selection: {
    start: number;
    end: number;
  };
  inputRef: React.MutableRefObject<TextInput>;
}) {
  const [uploading, setUploading] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const replace = (newText: string) =>
    text.substring(0, selection.start) +
    newText +
    text.substring(selection.end, text.length);

  const getSelected = () => text.substring(selection.start, selection.end);

  const onItalicPress = () => {
    const replacement = `*${getSelected()}*`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.start, end: selection.end },
    });
  };

  const onBoldPress = () => {
    const replacement = `**${getSelected()}**`;

    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.end, end: selection.end },
    });
  };

  const onLinkPress = async () => {
    Alert.prompt(
      t("Link"),
      t("toast.enterUrl"),
      (link) => {
        Alert.prompt(
          t("Label"),
          t("toast.enterLabel"),
          (label) => {
            setText(replace(`[${label}](${link})`));
          },
          "plain-text",
          "",
          "default",
          {
            userInterfaceStyle: theme.config.initialColorMode,
          }
        );
      },
      "plain-text",
      "",
      "url",
      {
        userInterfaceStyle: theme.config.initialColorMode,
      }
    );
  };

  const onQuotePress = () => {
    const replacement = `> ${getSelected()}`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.start - 2, end: selection.start - 2 },
    });
  };

  const onImagePress = async () => {
    let path;

    try {
      path = await selectImage();
    } catch (e: unknown) {
      const err = e as Error;
      writeToLog("Error getting images.");
      writeToLog(e.toString());

      switch (err.cause) {
        case ErrorCause.NO_PERMISSION:
          Alert.alert(
            t("alert.title.permissionsError"),
            t("alert.message.allowCameraRoll")
          );
          return;
        case ErrorCause.USER_CANCEL:
          // just close it, no notice
          return;
        default:
        // continue
      }
    }

    setUploading(true);

    let imgurLink;

    try {
      imgurLink = await uploadToImgur(path);
    } catch (e: unknown) {
      setUploading(false);

      writeToLog("Error uploading image.");
      writeToLog(e.toString());

      Alert.alert(t("alert.message.imgurUploadError"));
      return;
    }

    setUploading(false);

    const replacement = `![](${imgurLink})`;
    setText(replace(replacement));
  };

  return (
    <InputAccessoryView nativeID="accessory">
      <LoadingModal loading={uploading} />
      <HStack
        backgroundColor={theme.colors.app.bg}
        height={12}
        justifyContent="space-between"
        alignItems="center"
        px={4}
      >
        <IconButtonWithText
          onPressHandler={onItalicPress}
          icon={<IconItalic size={24} color={theme.colors.app.accent} />}
        />
        <IconButtonWithText
          onPressHandler={onBoldPress}
          icon={<IconBold size={24} color={theme.colors.app.accent} />}
        />
        <IconButtonWithText
          onPressHandler={onLinkPress}
          icon={<IconLink size={24} color={theme.colors.app.accent} />}
        />
        <IconButtonWithText
          onPressHandler={onQuotePress}
          icon={<IconQuote size={24} color={theme.colors.app.accent} />}
        />
        <IconButtonWithText
          onPressHandler={onImagePress}
          icon={<IconPhoto size={24} color={theme.colors.app.accent} />}
        />
      </HStack>
    </InputAccessoryView>
  );
}

export default KeyboardAccessory;

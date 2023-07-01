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
import { selectImage } from "../../helpers/ImageHelper";
import LoadingModal from "./Loading/LoadingModal";
import uploadToImgur from "../../helpers/ImgurHelper";
import { writeToLog } from "../../helpers/LogHelper";
import IconButtonWithText from "./common/IconButtonWithText";

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
      selection: { start: selection.end, end: selection.end },
    });
  };

  const onBoldPress = () => {
    const replacement = `**${getSelected()}**`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.end, end: selection.end },
    });
  };

  const onLinkPress = () => {
    const replacement = `[](${getSelected()})`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.start - 3, end: selection.start - 3 },
    });
  };

  const onQuotePress = () => {
    const replacement = `> ${getSelected()}`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.end, end: selection.end },
    });
  };

  const onImagePress = async () => {
    let path;

    try {
      path = await selectImage();
    } catch (e) {
      writeToLog("Error getting images.");
      writeToLog(e.toString());

      if (e.toString() === "permissions") {
        Alert.alert(
          "Permissions Error",
          "Please allow Memmy App to access your camera roll."
        );
        return;
      }
    }

    setUploading(true);

    let imgurLink;

    try {
      imgurLink = await uploadToImgur(path);
    } catch (e) {
      setUploading(false);

      writeToLog("Error uploading image.");
      writeToLog(e.toString());

      Alert.alert("Error uploading to Imgur.");
    }

    setUploading(false);

    const replacement = `![](${imgurLink})`;
    setText(replace(replacement));
  };

  return (
    <InputAccessoryView nativeID="accessory">
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
      <LoadingModal loading={uploading} />
    </InputAccessoryView>
  );
}

export default KeyboardAccessory;

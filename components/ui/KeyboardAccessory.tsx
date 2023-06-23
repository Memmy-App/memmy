import React, { SetStateAction, useState } from "react";
import { Alert, InputAccessoryView, TextInput } from "react-native";
import { HStack, Icon, IconButton, useTheme } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { selectImage } from "../../helpers/ImageHelper";
import LoadingModal from "./Loading/LoadingModal";
import uploadToImgur from "../../helpers/ImgurHelper";
import { writeToLog } from "../../helpers/LogHelper";

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
        <IconButton
          icon={
            <Icon
              as={MaterialCommunityIcons}
              name="format-italic"
              size={8}
              onPress={onItalicPress}
            />
          }
          size={8}
        />
        <IconButton
          icon={
            <Icon
              as={MaterialCommunityIcons}
              name="format-bold"
              size={8}
              onPress={onBoldPress}
            />
          }
          size={8}
        />
        <IconButton
          icon={
            <Icon
              as={MaterialIcons}
              name="link"
              size={8}
              onPress={onLinkPress}
            />
          }
          size={8}
        />
        <IconButton
          icon={
            <Icon
              as={MaterialIcons}
              name="format-quote"
              size={8}
              onPress={onQuotePress}
            />
          }
          size={8}
        />

        <IconButton
          icon={
            <Icon
              as={MaterialIcons}
              name="photo"
              size={8}
              onPress={onImagePress}
            />
          }
          size={8}
        />
      </HStack>
      <LoadingModal loading={uploading} />
    </InputAccessoryView>
  );
}

export default KeyboardAccessory;

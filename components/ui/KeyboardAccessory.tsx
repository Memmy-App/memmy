import React, { SetStateAction } from "react";
import { Alert, Button, InputAccessoryView, TextInput } from "react-native";
import { HStack, Icon, IconButton, useTheme, View } from "native-base";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

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
  const replace = (newText: string) =>
    text.substring(0, selection.start) +
    newText +
    text.substring(selection.end, text.length);

  const getSelected = () => text.substring(selection.start, selection.end);

  const onItalicPress = () => {
    const replacement = `**${getSelected()}**`;
    setText(replace(replacement));
    inputRef.current.setNativeProps({
      selection: { start: selection.end, end: selection.end },
    });
  };

  const onBoldPress = () => {
    const replacement = `*${getSelected()}*`;
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

  return (
    <InputAccessoryView nativeID="accessory">
      <HStack
        backgroundColor="screen.900"
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
      </HStack>
    </InputAccessoryView>
  );
}

export default KeyboardAccessory;

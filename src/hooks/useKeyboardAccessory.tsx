import React, { useCallback } from 'react';
import { Alert, TextInput } from 'react-native';
import { useThemeColorScheme } from '@hooks/useThemeColorScheme';

export interface ITextSelection {
  start: number;
  end: number;
}

export interface UseKeyboardAccessoryOptions {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  selection: ITextSelection;
  inputRef: React.MutableRefObject<TextInput | undefined>;
}

interface UseKeyboardAccessory {
  onBoldPress: () => void;
  onItalicPress: () => void;
  onLinkPress: () => Promise<void>;
  onQuotePress: () => void;
}

export const useKeyboardAccessory = (
  options: UseKeyboardAccessoryOptions,
): UseKeyboardAccessory => {
  const colorScheme = useThemeColorScheme();

  const { text, setText, selection, inputRef } = options;

  const getSelected = (): string =>
    text.substring(selection.start, selection.end);

  const replace = (newText: string): string => {
    return (
      text.substring(0, selection.start) +
      newText +
      text.substring(selection.end)
    );
  };

  const onBoldPress = useCallback(() => {
    const replacement = `**${getSelected()}**`;
    const newText = replace(replacement);

    setText(newText);

    inputRef.current?.setNativeProps({
      text: newText,
      selection: { start: selection.end, end: selection.end },
    });
  }, [text, selection]);

  const onItalicPress = useCallback(() => {
    const replacement = `*${getSelected()}*`;
    const newText = replace(replacement);

    setText(newText);

    inputRef.current?.setNativeProps({
      text: newText,
      selection: { start: selection.end, end: selection.end },
    });
  }, [text, selection]);

  const onLinkPress = useCallback(async () => {
    const selectedText = getSelected();

    Alert.prompt(
      'Link',
      'Enter the URL',
      (link) => {
        Alert.prompt(
          'Label',
          'Enter a label for the link',
          (label) => {
            const newText = replace(`[${label}](${link})`);

            setText(newText);
            inputRef.current?.setNativeProps({
              text: newText,
            });
          },
          'plain-text',
          selectedText,
          'default',
          { userInterfaceStyle: colorScheme },
        );
      },
      'plain-text',
      '',
      'url',
      { userInterfaceStyle: colorScheme },
    );
  }, [text, selection]);

  const onQuotePress = useCallback(() => {
    const replacement = `> ${getSelected()}`;
    const newText = replace(replacement);

    setText(newText);

    inputRef.current?.setNativeProps({
      selection: { start: selection.start - 2, end: selection.start - 2 },
      text: newText,
    });
  }, [text, selection]);

  return {
    onBoldPress,
    onItalicPress,
    onLinkPress,
    onQuotePress,
  };
};

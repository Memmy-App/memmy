import React, { useCallback, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { useThemeColorScheme } from '@hooks/useThemeColorScheme';
import { selectImage, uploadImage } from '@helpers/image';
import { useSettingsStore } from '@src/state';

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
  onImageUploadPress: () => Promise<void>;
  isUploading: boolean;
}

export const useKeyboardAccessory = (
  options: UseKeyboardAccessoryOptions,
): UseKeyboardAccessory => {
  const colorScheme = useThemeColorScheme();

  const useImgur = useSettingsStore((state) => state.useImgur);

  const { text, setText, selection, inputRef } = options;

  const [isUploading, setIsUploading] = useState(false);

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

  const onImageUploadPress = useCallback(
    async (overrideImgur = false) => {
      const imageUri = await selectImage();

      if (imageUri == null) return;

      setIsUploading(true);

      try {
        const url = await uploadImage(imageUri, useImgur || overrideImgur);

        setIsUploading(false);

        Alert.prompt(
          'Alt Text',
          'Enter the alt text for the image. If left blank, the alt text will be set to the image URL.',
          (altText) => {
            const newText = replace(
              `![${altText !== '' ? altText : url}](${url})`,
            );

            inputRef.current?.setNativeProps({
              selection: { start: selection.end, end: selection.end },
              text: newText,
            });
          },
          'plain-text',
          '',
          'default',
          { userInterfaceStyle: colorScheme },
        );
      } catch (e) {
        setIsUploading(false);
        Alert.alert('Error', 'There was an error uploading the image.', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Try Again',
            onPress: () => {
              void onImageUploadPress();
            },
          },
          {
            text: `Try Using ${!useImgur ? 'Imgur' : 'Your Instance'}`,
            onPress: () => {
              void onImageUploadPress(!useImgur);
            },
          },
        ]);
      }
    },
    [text, selection],
  );

  return {
    onBoldPress,
    onItalicPress,
    onLinkPress,
    onQuotePress,
    onImageUploadPress,
    isUploading,
  };
};

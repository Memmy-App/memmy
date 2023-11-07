import React, { useCallback } from 'react';
import { InputAccessoryView } from 'react-native';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import {
  Bold,
  Camera,
  Italic,
  Link,
  Quote,
  Video,
} from '@tamagui/lucide-icons';
import { useKeyboardAccessory, UseKeyboardAccessoryOptions } from '@src/hooks';
import { XStack } from 'tamagui';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function KeyboardAccessoryView(
  params: UseKeyboardAccessoryOptions,
): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const accessory = useKeyboardAccessory(params);

  const onGifPress = useCallback(() => {
    navigation.push('Giphy');
  }, []);

  return (
    <InputAccessoryView nativeID="accessory">
      <LoadingOverlay visible={accessory.isUploading} />
      <XStack
        height={40}
        justifyContent="space-between"
        alignItems="center"
        px="$3"
        backgroundColor="$bg"
      >
        <AnimatedIconButton
          icon={Bold}
          iconSize={20}
          color="$accent"
          onPress={accessory.onBoldPress}
        />
        <AnimatedIconButton
          icon={Italic}
          iconSize={20}
          color="$accent"
          onPress={accessory.onItalicPress}
        />
        <AnimatedIconButton
          icon={Link}
          iconSize={20}
          color="$accent"
          onPress={accessory.onLinkPress}
        />
        <AnimatedIconButton
          icon={Quote}
          iconSize={20}
          color="$accent"
          onPress={accessory.onQuotePress}
        />
        <AnimatedIconButton
          icon={Video}
          iconSize={20}
          color="$accent"
          onPress={onGifPress}
        />
        <AnimatedIconButton
          icon={Camera}
          iconSize={20}
          color="$accent"
          onPress={accessory.onImageUploadPress}
        />
      </XStack>
    </InputAccessoryView>
  );
}

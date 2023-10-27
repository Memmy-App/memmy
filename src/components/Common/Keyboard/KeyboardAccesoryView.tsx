import React from 'react';
import { InputAccessoryView } from 'react-native';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Bold, Camera, Italic, Link, Quote } from '@tamagui/lucide-icons';
import { useKeyboardAccessory, UseKeyboardAccessoryOptions } from '@src/hooks';
import { XStack } from 'tamagui';

export default function KeyboardAccessoryView(
  params: UseKeyboardAccessoryOptions,
): React.JSX.Element {
  const accessory = useKeyboardAccessory(params);

  return (
    <InputAccessoryView nativeID="accessory">
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
          icon={Camera}
          iconSize={20}
          color="$accent"
          onPress={accessory.onQuotePress}
        />
      </XStack>
    </InputAccessoryView>
  );
}

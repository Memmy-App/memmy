import React, { useEffect, useState } from 'react';
import { INavigationProps } from '@src/types';
import { Spacer, Text, useTheme, XStack, YStack } from 'tamagui';
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  returnedResults,
} from 'reanimated-color-picker';
import { setSetting, useAccent } from '@src/state';

export default function SettingsAccentScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const theme = useTheme();
  const accent = useAccent();

  const [hex, setHex] = useState(accent ?? theme.accent.val);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setSetting('accentColor', hex);
    });

    return unsubscribe;
  }, [hex]);

  const onSelectColor = ({ hex }: returnedResults): void => {
    setHex(hex);
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <ColorPicker
        style={{ width: '70%' }}
        value={accent ?? theme.accent.val}
        onComplete={onSelectColor}
      >
        <XStack justifyContent="center" mb="$1">
          <Text fontSize="$5" right={50}>
            Current
          </Text>
          <Text fontSize="$5" left={50}>
            New
          </Text>
        </XStack>
        <Preview hideText />
        <Spacer />
        <Panel1 />
        <Spacer />
        <HueSlider />
      </ColorPicker>
    </YStack>
  );
}

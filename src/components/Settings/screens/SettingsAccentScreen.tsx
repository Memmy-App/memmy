import React, { useEffect, useState } from 'react';
import { INavigationProps } from '@src/types';
import VStack from '@components/Common/Stack/VStack';
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  returnedResults,
} from 'reanimated-color-picker';
import { useAccent } from '@src/state/settings/settingsStore';
import { Spacer, Text, useTheme } from 'tamagui';
import HStack from '@components/Common/Stack/HStack';
import { setSetting } from '@src/state/settings/actions';

export default function SettingsAccentScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const theme = useTheme();
  const accent = useAccent();

  const [hex, setHex] = useState(accent ?? theme.accent.val);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      setSetting('accentColor', hex);
    });

    return unsubscribe;
  }, [hex]);

  const onSelectColor = ({ hex }: returnedResults): void => {
    setHex(hex);
  };

  return (
    <VStack flex={1} alignItems="center" justifyContent="center">
      <ColorPicker
        style={{ width: '70%' }}
        value={accent ?? theme.accent.val}
        onComplete={onSelectColor}
      >
        <HStack justifyContent="center" marginBottom="$1">
          <Text fontSize="$5" right={50}>
            Current
          </Text>
          <Text fontSize="$5" left={50}>
            New
          </Text>
        </HStack>
        <Preview hideText />
        <Spacer />
        <Panel1 />
        <Spacer />
        <HueSlider />
      </ColorPicker>
    </VStack>
  );
}

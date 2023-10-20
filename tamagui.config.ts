import { createTamagui } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { customTokens, themes } from '@src/theme';
import { createInterFont } from '@tamagui/font-inter';
import { createAnimations } from '@tamagui/animations-react-native';

const headingFont = createInterFont();
const bodyFont = createInterFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
  },
  weight: {
    4: '300',
    5: '500',
    6: '600',
    7: '700',
    9: '900',
  },
  face: {
    300: { normal: 'InterLight', italic: 'InterLight-Italic' },
    500: { normal: 'Inter', italic: 'Inter-Italic' },
    700: { normal: 'InterSemiBold', italic: 'InterSemiBold-Italic' },
    900: { normal: 'InterBold', italic: 'InterBold-Italic' },
  },
});

const tamaguiConfig = createTamagui({
  shorthands,
  tokens: customTokens,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
  animations: createAnimations({
    fast: {
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    slow: {
      damping: 20,
      stiffness: 60,
    },
  }),
});

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;

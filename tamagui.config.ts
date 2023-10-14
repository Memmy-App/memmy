import { createTamagui } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { customTokens, themes } from '@src/theme';
import { createInterFont } from '@tamagui/font-inter';

const headingFont = createInterFont();
const bodyFont = createInterFont();

const tamaguiConfig = createTamagui({
  shorthands,
  tokens: customTokens,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
});

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;

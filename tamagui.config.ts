import { createTamagui } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { customTokens, themes } from '@src/theme';

const tamaguiConfig = createTamagui({
  shorthands,
  tokens: customTokens,
  themes,
});

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;

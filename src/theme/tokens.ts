import { tokens } from '@tamagui/themes';
import { createTokens } from 'tamagui';
import { lightThemeColors } from '@src/theme/light';
import { darkThemeColors } from '@src/theme/dark/darkTheme';

export const customTokens = createTokens({
  ...tokens,
  color: {
    ...tokens.color,
  },
  lightThemeColors: {
    ...lightThemeColors,
  },
  darkThemeColors: {
    ...darkThemeColors,
  },
});

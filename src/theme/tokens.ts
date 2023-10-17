import { tokens } from '@tamagui/themes';
import { createTokens } from 'tamagui';
import { lightTheme, oksolarLightTheme } from '@src/theme/light';
import { darkTheme } from '@src/theme/dark/darkTheme';
import {
  draculaTheme,
  embarkTheme,
  goldenHourTheme,
  moodyPurpleTheme,
  nauticalTheme,
  nightOwlTheme,
  oksolarTheme,
  oledTheme,
  sleepyRainForestTheme,
  sunsetTheme,
} from '@src/theme/dark';

export const customTokens = createTokens({
  ...tokens,
  color: {
    ...tokens.color,
  },
  lightThemeColors: {
    ...lightTheme,
  },
  darkThemeColors: {
    ...darkTheme,
  },
  draculaThemeColors: {
    ...draculaTheme,
  },
  embarkThemeColors: {
    ...embarkTheme,
  },
  goldenHourThemeColors: {
    ...goldenHourTheme,
  },
  moodyPurpleThemeColors: {
    ...moodyPurpleTheme,
  },
  nauticalThemeColors: {
    ...nauticalTheme,
  },
  nightOwlThemeColors: {
    ...nightOwlTheme,
  },
  oksolarThemeColors: {
    ...oksolarTheme,
  },
  oledThemeColors: {
    ...oledTheme,
  },
  sleepyRainforestThemeColors: {
    ...sleepyRainForestTheme,
  },
  sunsetThemeColors: {
    ...sunsetTheme,
  },
  oksolarLightThemeColors: {
    ...oksolarLightTheme,
  },
});

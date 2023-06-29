import { extendTheme } from "native-base";
import {
  darkThemeColors,
  draculaThemeColors,
  goldenHourThemeColors,
  moodyPurpleThemeColors,
  nauticalThemeColors,
  nightOwlThemeColors,
  sleepyRainforestThemeColors,
  sunsetThemeColors,
} from "./darkColors";
import { lightThemeColors } from "./lightColors";
import { commonSettings } from "./common";

const moodyPurpleTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: moodyPurpleThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const darkTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: darkThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const draculaTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: draculaThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const draculaThemePurple = extendTheme({
  ...commonSettings,
  colors: {
    app: {
      ...draculaThemeColors,
      accent: "#bd93f9",
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

const lightTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: lightThemeColors,
  },

  config: {
    initialColorMode: "light",
  },
});

const nightOwlTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: nightOwlThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const oksolarDarkTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oksolarDarkColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

export type ThemeType = typeof lightTheme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {}
}

export {
  lightTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  nightOwlTheme,
  oksolarDarkTheme,
  oksolarLightTheme,
  moodyPurpleTheme,
  sleepyRainforestTheme,
  goldenHourTheme,
  nauticalTheme,
  sunsetTheme,
};

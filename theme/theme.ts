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
  oksolarDarkThemeColors,
  oceanicNextThemeColors,
  oledThemeColors,
} from "./darkColors";
import {
  lightThemeColors,
  oksolarLightThemeColors,
       } from "./lightColors";
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

const sleepyRainforestTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: sleepyRainforestThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const goldenHourTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: goldenHourThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const nauticalTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: nauticalThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const sunsetTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: sunsetThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const oksolarDarkTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oksolarDarkThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const oksolarLightTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oksolarLightThemeColors,
  },
  config: {
    initialColorMode: "light",
  },
});

const oceanicNextTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oceanicNextThemeColors,
const oledTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oledThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

export type ThemeType = typeof lightTheme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {
    config: {
      initialColorMode: "dark" | "light";
    };
  }
}

export {
  lightTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  nightOwlTheme,
  moodyPurpleTheme,
  sleepyRainforestTheme,
  goldenHourTheme,
  nauticalTheme,
  sunsetTheme,
  oksolarDarkTheme,
  oksolarLightTheme,
  oceanicNextTheme,
  oledTheme,
};

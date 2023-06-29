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

const oksolarDarkColors: IColors = {
  accent: "#F23749",
  accentHighlight: "#E7F2FF",

  textPrimary: "#FFF",
  textSecondary: "#8FAAAB",
  textTertiary: "#8FAAAB",
  fg: "#002D38",
  bg: "#093946",
  bgSecondary: "#093946",
  bgTertiary: "#002D38",

  border: "#FFF",

  upvote: "#D56500",
  upvoteText: "#FFF",
  downvote: "#7D80D1",
  downvoteText: "#FFF",

  success: "#819500",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F23749",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#AC8300",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#2B90D8",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#819500",
    admin: "#FF4848",
    dev: "#7D80D1",
    op: "#2B90D8",
    me: "#AC8300",
  },

  comments: {
    1: "#F23749",
    2: "#D56500",
    3: "#AC8300",
    4: "#819500",
    5: "#259D94",
  },

  inputBg: "#093946",

  bookmark: "#819500",
  bookmarkText: "#fff",
};

const oksolarDarkTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oksolarDarkColors,
=======
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

const oksolarLightColors: IColors = {
  accent: "#F23749",
  accentHighlight: "#E7F2FF",

  textPrimary: "#FFF",
  textSecondary: "#8FAAAB",
  textTertiary: "#8FAAAB",
  fg: "#657377",
  bg: "#FBF7EF",
  bgSecondary: "#F1E9D2",
  bgTertiary: "#FCF7E8",

  border: "#FFF",

  upvote: "#D56500",
  upvoteText: "#FFF",
  downvote: "#7D80D1",
  downvoteText: "#FFF",

  success: "#819500",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F23749",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#AC8300",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#2B90D8",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#819500",
    admin: "#FF4848",
    dev: "#7D80D1",
    op: "#2B90D8",
    me: "#AC8300",
  },

  comments: {
    1: "#F23749",
    2: "#D56500",
    3: "#AC8300",
    4: "#819500",
    5: "#259D94",
  },

  inputBg: "#093946",

  bookmark: "#819500",
  bookmarkText: "#fff",
};

const oksolarLightTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: oksolarLightColors,
  },
  config: {
    initialColorMode: "light",
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

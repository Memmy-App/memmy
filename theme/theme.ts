import { extendTheme } from "native-base";

interface ICommentChainColors {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

interface IUserColors {
  mod: string;
  admin: string;
  dev: string;
  op: string;
  me: string;
}

interface IColors {
  accent: string;
  accentHighlight: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  fg: string;
  bg: string;
  bgSecondary: string;
  bgTertiary: string;

  border: string; // color for border and divider

  upvote: string; // upvote color
  upvoteText: string; // icon color for when upvote button is selected
  downvote: string; // downvote color
  downvoteText: string; // icon color for when downvote button is selected

  success: string;
  successBg: string;
  successBorder: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  warn: string;
  warnBg: string;
  warnBorder: string;
  info: string;
  infoBg: string;
  infoBorder: string;

  users: IUserColors;
  comments: ICommentChainColors;

  inputBg: string;

  bookmark: string;
  bookmarkText: string;
}

const commonSettings = {
  components: {
    Text: {
      defaultProps: {
        allowFontScaling: false,
      },
    },
  },
  fontConfig: {
    Inter: {
      100: {
        normal: "Inter-Thin",
        italic: "Inter-ThinItalic",
      },
      200: {
        normal: "Inter-ExtraLight",
        italic: "Inter-ExtraLightItalic",
      },
      300: {
        normal: "Inter-Light",
        italic: "Inter-LightItalic",
      },
      400: {
        normal: "Inter-Regular",
        italic: "Inter-Italic",
      },
      500: {
        normal: "Inter-Medium",
        italic: "Inter-MediumItalic",
      },
      600: {
        normal: "Inter-SemiBold",
        italic: "Inter-SemiBoldItalic",
      },
      700: {
        normal: "Inter-Bold",
        italic: "Inter-BoldItalic",
      },
      800: {
        normal: "Inter-ExtraBold",
        italic: "Inter-ExtraBoldItalic",
      },
      900: {
        normal: "Inter-Black",
        italic: "Inter-BlackItalic",
      },
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "Inter",
  },
};

const brownThemeColors: IColors = {
  accent: "#1A91FF",
  accentHighlight: "#E7F2FF",

  textPrimary: "#FFF",
  textSecondary: "#B8B9C1",
  textTertiary: "#a1a2a9",
  fg: "#1c1917",
  bg: "#292524",
  bgSecondary: "#1c1917",
  bgTertiary: "#1c1917",

  border: "#C8C8CA",

  upvote: "#EE923D",
  upvoteText: "#FFF",
  downvote: "#1A84E5",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#3398f2",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#54CB60",
    admin: "#FF4848",
    dev: "#CB66FA",
    op: "#54CB60",
    me: "#FFB800",
  },

  comments: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  inputBg: "#3C3C3C",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

const brownTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: brownThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const purpleThemeColors: IColors = {
  accent: "#8877F1",
  accentHighlight: "#E7F2FF",

  textPrimary: "#EDE1FF",
  textSecondary: "#AEB5ED",
  textTertiary: "#a1a2a9",

  fg: "#1E1529",
  bg: "#120E1D",
  bgSecondary: "#1E1529",
  bgTertiary: "#120E1D",

  border: "#C8C8CA",

  upvote: "#EE923D",
  upvoteText: "#FFF",
  downvote: "#1A84E5",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#3398f2",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#54CB60",
    admin: "#FF4848",
    dev: "#CB66FA",
    op: "#54CB60",
    me: "#FFB800",
  },

  comments: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  inputBg: "#32294D",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

const purpleTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: purpleThemeColors,
  },
  config: {
    initialColorMode: "dark",
  },
});

const darkThemeColors: IColors = {
  accent: "#2C9AFF",
  accentHighlight: "#1F2E45",

  textPrimary: "#FFFFFF",
  textSecondary: "#B8B9C1",
  textTertiary: "#B8B9C1",

  fg: "#1B1B1B",
  bg: "#101010",
  bgSecondary: "#1B1B1B",
  bgTertiary: "#3C3C3C",

  border: "#242424",

  upvote: "#EE923D",
  upvoteText: "#FFF",
  downvote: "#1A84E5",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#3398f2",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#54CB60",
    admin: "#FF4848",
    dev: "#CB66FA",
    op: "#54CB60",
    me: "#FFB800",
  },

  comments: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  inputBg: "#2F2F2F",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

const darkTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: darkThemeColors,
  },

  config: {
    initialColorMode: "dark",
  },
});

const draculaThemeColors: IColors = {
  accent: "#ff79c6",
  accentHighlight: "#bd93f9",

  textPrimary: "#F8F8F2",
  textSecondary: "#ececec",
  textTertiary: "#e7e7e7",

  fg: "#232635",
  bg: "#1B1D29",
  bgSecondary: "#282a36",
  bgTertiary: "#10141C",

  border: "#44475a",

  upvote: "#FF9580",
  upvoteText: "#FFF",
  downvote: "#9580FF",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#3398f2",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#50fa7b",
    admin: "#ff5555",
    dev: "#bd93f9",
    op: "#8be9fd",
    me: "#ffb86c",
  },

  comments: {
    1: "#ff79c6",
    2: "#ffb86c",
    3: "#f1fa8c",
    4: "#50fa7b",
    5: "#8be9fd",
  },

  inputBg: "#252837",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

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

const lightThemeColors: IColors = {
  accent: "#2092FB",
  accentHighlight: "#E7F2FF",

  textPrimary: "#393939",
  textSecondary: "#979BA2",
  textTertiary: "#5C5C5C",

  fg: "#FFFFFF",
  bg: "#F2F2F2",
  bgSecondary: "#ECECEC",
  bgTertiary: "#DEDEDE",

  border: "#C8C8CA",

  upvote: "#EE923D",
  upvoteText: "#FFF",
  downvote: "#1A84E5",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "#3398f2",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#54CB60",
    admin: "#FF4848",
    dev: "#CB66FA",
    op: "#54CB60",
    me: "#FFB800",
  },

  comments: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  inputBg: "#FAFAFA",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

const lightTheme = extendTheme({
  ...commonSettings,
  colors: {
    app: lightThemeColors,
  },

  config: {
    initialColorMode: "light",
  },
});

const nightOwlThemeColors: IColors = {
  accent: "#544AC6",
  accentHighlight: "#1F1932",

  textPrimary: "#C2B8DF",
  textSecondary: "#8B7C92",
  textTertiary: "#8B7C92",

  fg: "#090909",
  bg: "#000000",
  bgSecondary: "#130F1B",
  bgTertiary: "#130F1B",

  border: "#241543",

  upvote: "#EE923D",
  upvoteText: "#FFF",
  downvote: "#1A84E5",
  downvoteText: "#FFF",

  success: "#48C10F",
  successBg: "#D7F8DA",
  successBorder: "#2B8302",
  error: "#F8372B",
  errorBg: "#FFC6C2",
  errorBorder: "#A62525",
  warn: "#DEA435",
  warnBg: "#FFEDD9",
  warnBorder: "#CB6A11",
  info: "",
  infoBg: "#CAE6FF",
  infoBorder: "#316677",

  users: {
    mod: "#54CB60",
    admin: "#FF4848",
    dev: "#CB66FA",
    op: "#54CB60",
    me: "#FFB800",
  },

  comments: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  inputBg: "#221C2F",

  bookmark: "#48C10F",
  bookmarkText: "#fff",
};

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
  brownTheme,
  purpleTheme,
  draculaTheme,
  draculaThemePurple,
  nightOwlTheme,
  oksolarDarkTheme,
};

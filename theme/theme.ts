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

  fg: "#101010",
  bg: "#101010",
  bgSecondary: "#1B1B1B",
  bgTertiary: "#101010",

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
  accent: "#1A91FF",
  accentHighlight: "#E7F2FF",

  textPrimary: "#FFF",
  textSecondary: "#B8B9C1",
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

  inputBg: "#151515",

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
  accent: "#1A91FF",
  accentHighlight: "#E7F2FF",

  textPrimary: "#FFF",
  textSecondary: "#ececec",
  textTertiary: "#e7e7e7",

  fg: "#1B1B1B",
  bg: "#070707",
  bgSecondary: "#000000",
  bgTertiary: "#0c0c0c",

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

  inputBg: "#3C3C3C",

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

const lightThemeColors: IColors = {
  accent: "#1A91FF",
  accentHighlight: "#E7F2FF",

  textPrimary: "#303030",
  textSecondary: "#5C5C5C",
  textTertiary: "#979BA2",

  fg: "#FFFFFF",
  bg: "#F4F4F4",
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

export type ThemeType = typeof lightTheme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {}
}

export { lightTheme, darkTheme, brownTheme, purpleTheme };

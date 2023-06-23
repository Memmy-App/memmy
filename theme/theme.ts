import { extendTheme } from "native-base";

interface IAppColors {
  nativeHeader: string;
  nativeHeaderTitle: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTricondary: string;

  accentColor: string;
  inputBackground: string;

  upvoteColor: string;
  downvoteColor: string;

  iconColor: string;
  iconColor2: string;

  commentChain: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };

  primaryText: string;
  secondaryText: string;

  buttonOneIcon: string;
  buttonTwoIcon: string;
  buttonThreeIcon: string;

  buttonOneText: string;
  buttonTwoText: string;
  buttonThreeText: string;

  buttonOne: string;
  buttonOneSelected: string;

  opColor: string;
  selfColor: string;

  tableBorder: string;

  refreshWheel: string;
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

const brownThemeColors: IAppColors = {
  nativeHeader: "#1c1917",
  nativeHeaderTitle: "#fff",
  backgroundPrimary: "#1c1917",
  backgroundSecondary: "#292524",
  backgroundTricondary: "#44403c",

  accentColor: "#1A91FF",
  inputBackground: "#44403c",

  upvoteColor: "#EE923D",
  downvoteColor: "#1A84E5",

  iconColor: "#9A9A9A",
  iconColor2: "#007AFF",

  commentChain: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  primaryText: "#fff",
  secondaryText: "#999999",

  buttonOneIcon: "#007AFF",
  buttonTwoIcon: "",
  buttonThreeIcon: "",

  buttonOneText: "#fff",
  buttonTwoText: "",
  buttonThreeText: "",

  buttonOne: "#44403c",
  buttonOneSelected: "#292524",

  opColor: "#54CB60",
  selfColor: "#DEA435",

  tableBorder: "#78716c",

  refreshWheel: "#d6d3d1",
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

const purpleThemeColors: IAppColors = {
  nativeHeader: "#000000",
  nativeHeaderTitle: "#fff",
  backgroundPrimary: "#000000",
  backgroundSecondary: "#151515",
  backgroundTricondary: "#292929",

  accentColor: "#1A91FF",
  inputBackground: "#292929",

  upvoteColor: "#EE923D",
  downvoteColor: "#1A84E5",

  iconColor: "#9A9A9A",
  iconColor2: "#007AFF",

  commentChain: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  primaryText: "#fff",
  secondaryText: "#999999",

  buttonOneIcon: "#007AFF",
  buttonTwoIcon: "",
  buttonThreeIcon: "",

  buttonOneText: "#fff",
  buttonTwoText: "",
  buttonThreeText: "",

  buttonOne: "#292929",
  buttonOneSelected: "#201929",

  opColor: "#54CB60",
  selfColor: "#DEA435",

  tableBorder: "#78716c",

  refreshWheel: "#d6d3d1",
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

const darkThemeColors: IAppColors = {
  nativeHeader: "#000000",
  nativeHeaderTitle: "#fff",
  backgroundPrimary: "#000000",
  backgroundSecondary: "#151515",
  backgroundTricondary: "#292929",

  accentColor: "#1A91FF",
  inputBackground: "#292929",

  upvoteColor: "#EE923D",
  downvoteColor: "#1A84E5",

  iconColor: "#9A9A9A",
  iconColor2: "#007AFF",

  commentChain: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  primaryText: "#fff",
  secondaryText: "#999999",

  buttonOneIcon: "#007AFF",
  buttonTwoIcon: "",
  buttonThreeIcon: "",

  buttonOneText: "#fff",
  buttonTwoText: "",
  buttonThreeText: "",

  buttonOne: "#292929",
  buttonOneSelected: "#201929",

  opColor: "#54CB60",
  selfColor: "#DEA435",

  tableBorder: "#78716c",

  refreshWheel: "#d6d3d1",
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

const lightThemeColors: IAppColors = {
  nativeHeader: "#f3f3f3",
  nativeHeaderTitle: "#000",
  backgroundPrimary: "#fafafa",
  backgroundSecondary: "#fff",
  backgroundTricondary: "#dcdcdc",

  accentColor: "#1A91FF",
  inputBackground: "#dcdcdc",

  upvoteColor: "#EE923D",
  downvoteColor: "#1A84E5",

  iconColor: "#9A9A9A",
  iconColor2: "#007AFF",

  commentChain: {
    1: "#FA6969",
    2: "#FFB800",
    3: "#FFE500",
    4: "#36CF3C",
    5: "#4BA9FF",
  },

  primaryText: "#000",
  secondaryText: "#2a2a2a",

  buttonOneIcon: "#007AFF",
  buttonTwoIcon: "",
  buttonThreeIcon: "",

  buttonOneText: "#000",
  buttonTwoText: "",
  buttonThreeText: "",

  buttonOne: "#dcdcdc",
  buttonOneSelected: "#201929",

  opColor: "#54CB60",
  selfColor: "#DEA435",

  tableBorder: "#78716c",

  refreshWheel: "#d6d3d1",
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

export type DarkThemeType = typeof darkTheme;

declare module "native-base" {
  interface ICustomTheme extends DarkThemeType {}
}

export { darkTheme, purpleTheme, brownTheme, lightTheme };

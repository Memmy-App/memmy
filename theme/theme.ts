import { extendTheme } from "native-base";

const brownTheme = extendTheme({
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
  colors: {
    screen: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },

    lightText: "#ffffff",
    darkText: "#ffffff",

    secondaryText: "#C7C7C7",
    primaryText: "#fff",

    app: {
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
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

const purpleTheme = extendTheme({
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
  colors: {
    screen: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },

    lightText: "#ffffff",
    darkText: "#ffffff",

    secondaryText: "#C7C7C7",

    app: {
      nativeHeader: "#1A1726",
      nativeHeaderTitle: "#fff",
      backgroundPrimary: "#1A1726",
      backgroundSecondary: "#271C37",
      backgroundTricondary: "#2F253C",

      accentColor: "#1A91FF",
      inputBackground: "#201929",

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

      buttonOne: "#2F253C",
      buttonOneSelected: "#201929",

      opColor: "#54CB60",
      selfColor: "#DEA435",

      tableBorder: "#78716c",

      refreshWheel: "#d6d3d1",
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

const darkTheme = extendTheme({
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
  colors: {
    screen: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },

    lightText: "#ffffff",
    darkText: "#ffffff",

    secondaryText: "#C7C7C7",

    app: {
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
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

const lightTheme = extendTheme({
  components: {
    Text: {
      defaultProps: {
        allowFontScaling: false,
      },
      baseStyle: {
        color: "#000",
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
  colors: {
    screen: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },

    lightText: "#000",
    darkText: "#000",

    secondaryText: "#C7C7C7",
    primary: "#000",

    app: {
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
    },
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

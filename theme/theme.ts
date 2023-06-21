import { extendTheme } from "native-base";

const darkTheme = extendTheme({
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
    accentColor: "#1A91FF",
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
      header: "#1c1917",
      headerTitle: "#fff",
      backgroundPrimary: "#1c1917",
      backgroundSecondary: "#292524",
      backgroundTricondary: "#44403c",

      inputBackground: "#44403c",

      upvoteColor: "#EE923D",
      downvoteColor: "#1A84E5",

      iconColor: "#9A9A9A",

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
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

export type DarkThemeType = typeof darkTheme;

declare module "native-base" {
  interface ICustomTheme extends DarkThemeType {}
}

export default darkTheme;

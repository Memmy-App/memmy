import { extendTheme } from "native-base";

const darkTheme = extendTheme({
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

    app: {
      background: "#292524",
      commentBackground: "#292524",
    },

    appTheme: {
      darkAccent: "#",
      lightAccent: "#",
      darkForeground: "#",
      lightSecondaryText: "#",
      darkSecondaryText: "#",
      downvoteColor: "#",
      upvoteColor: "#",
      white: "#",
      commentChain1: "#",
      commentChain2: "#",
      commentChain3: "#",
      commentChain4: "#",
      commentChain5: "#",
      extraLightAccent: "#",
      black: "#",
      lightBorder: "#",
      moderatorColor: "#",
      good: "#",
      lightThirdLayerText: "#",
      adminColor: "#",
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

/*
Background: warmGray.500
Card: warmGray.700

 */

import { extendTheme } from "native-base";

const darkTheme = extendTheme({
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

    secondaryText: "#9A9A9A",

    app: {
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

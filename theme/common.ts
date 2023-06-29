export const commonSettings = {
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

export interface IColors {
  accent: string;
  accentHighlight: string;

  textPrimary: string;
  textSecondary: string;

  fg: string;
  bg: string;
  navBarBg: string;

  border: string; // color for border and divider

  upvote: string; // upvote color
  upvoteText: string; // icon color for when upvote button is selected
  downvote: string; // downvote color
  downvoteText: string; // icon color for when downvote button is selected

  success: string;
  successText: string;
  error: string;
  errorText: string;
  warn: string;
  warnText: string;
  info: string;
  infoText: string;

  users: IUserColors;
  comments: ICommentChainColors;

  inputBg: string;

  bookmark: string;
  bookmarkText: string;
}

export const systemFontSettings = {
  fontConfig: {},
  fonts: {
    body: undefined,
    heading: undefined,
    mono: undefined,
  },
};

interface ICommentChainColors {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
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

  mod: string;
  modText: string;
  admin: string;
  adminText: string;
  dev: string;
  devText: string;
  op: string;
  opText: string;

  comments: ICommentChainColors;

  inputBg: string;

  bookmark: string;
  bookmarkText: string;
}

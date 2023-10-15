export const systemFontSettings = {
  fontConfig: {},
  fonts: {
    body: undefined,
    heading: undefined,
    mono: undefined,
  },
};

export interface IColors {
  accent: string;
  accentHighlight: string;

  color: string;
  secondary: string;

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

  'comments-1': string;
  'comments-2': string;
  'comments-3': string;
  'comments-4': string;
  'comments-5': string;

  inputBg: string;

  bookmark: string;
  bookmarkText: string;

  statusBar: 'light' | 'dark';
  colorScheme: 'light' | 'dark';
}

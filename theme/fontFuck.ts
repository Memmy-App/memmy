import store from "../store";

interface IFontSizes {
  // "2xs": number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  // "3xl": number;
  // "4xl": number;
  // "5xl": number;
  // "6xl": number;
  // "7xl": number;
  // "8xl": number;
  // "9xl": number;
}

const defaultFontSizes: IFontSizes = {
  // "2xs": 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  // "3xl": 30,
  // "4xl": 36,
  // "5xl": 48,
  // "6xl": 60,
  // "7xl": 72,
  // "8xl": 96,
  // "9xl": 128,
};

const fontMap: Record<number, IFontSizes> = {
  1: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
  },
  2: defaultFontSizes,
  3: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    "2xl": 26,
  },
};

function getFontScale(): IFontSizes {
  const { settings } = store.getState();

  if (!settings.useSystemTextSize) {
    console.log(fontMap[settings.fontSize]);
    return fontMap[settings.fontSize];
  }
  return defaultFontSizes;
}

export default getFontScale;

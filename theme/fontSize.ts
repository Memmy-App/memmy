import store from "../store";

interface IFontSizes {
  "2xs": number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  "4xl": number;
  "5xl": number;
  "6xl": number;
  "7xl": number;
  "8xl": number;
  "9xl": number;
}

export function createFontSizes(modifier: number): IFontSizes {
  return {
    "2xs": 10 + modifier,
    xs: 12 + modifier,
    sm: 14 + modifier,
    md: 16 + modifier,
    lg: 18 + modifier,
    xl: 20 + modifier,
    "2xl": 24 + modifier,
    "3xl": 30 + modifier,
    "4xl": 36 + modifier,
    "5xl": 48 + modifier,
    "6xl": 60 + modifier,
    "7xl": 72 + modifier,
    "8xl": 96 + modifier,
    "9xl": 128 + modifier,
  };
}

export const fontSizeMap: Record<number, number> = {
  1: -3,
  2: -2,
  3: -1,
  4: 0,
  5: 1,
  6: 2,
  7: 3,
};

export const FontWeightMap: Record<string, number> = {
  "Regular (Default)": 400,
  Medium: 500,
  "Semi-Bold": 600,
  Bold: 700,
};

function getFontScale(): IFontSizes | null {
  const { settings } = store.getState();

  const fontSizes = createFontSizes(fontSizeMap[settings.fontSize]);

  if (!settings.isSystemTextSize) {
    return fontSizes;
  }
  return null;
}

export default getFontScale;

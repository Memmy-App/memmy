import { createStyled, FontResolver } from "@gluestack-style/react";
import { AnimationResolver } from "@gluestack-style/animation-plugin";

const fontWeightMap = {
  hairline: "ExtraLight",
  thin: "Thin",
  light: "Light",
  normal: "Regular",
  medium: "Medium",
  semibold: "SemiBold",
  bold: "Bold",
  extrabold: "ExtraBold",
  black: "Black",
  extraBlack: "Black",
};

const fontMapper = (style: any) => {
  style.fontFamily = `${style.fontFamily}-${fontWeightMap[style.fontWeight]}${
    style.fontStyle === "italic" ? "Italic" : ""
  }`;
  style.fontWeight = undefined;
  style.fontStyle = undefined;
};

export const styled = createStyled([
  new AnimationResolver({}),
  new FontResolver({
    mapFonts: fontMapper,
  }),
]);

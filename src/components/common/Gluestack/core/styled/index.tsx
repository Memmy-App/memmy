import { createStyled, FontResolver } from "@gluestack-style/react";
import { AnimationResolver } from "@gluestack-style/animation-plugin";
import { writeToLog } from "src/helpers/LogHelper";

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
  writeToLog(`FONT: ${style.fontFamily}`);
  style.fontWeight = undefined;
  style.fontStyle = undefined;
};

export const styled = createStyled([
  new AnimationResolver({}),
  new FontResolver({
    mapFonts: fontMapper,
  }),
]);

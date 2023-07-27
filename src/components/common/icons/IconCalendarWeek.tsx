import React from "react";
import Svg, {Path} from "react-native-svg";
import {type TablerIconsProps} from "tabler-icons-react-native";

// eslint-disable-next-line import/prefer-default-export
export function IconCalendarWeek({
  size = 24,
  color = "#1f2937", // Defaut tabler color
  stroke = 2,
}: TablerIconsProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      stroke={color || "currentColor"}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
      <Path d="M16 3v4" />
      <Path d="M8 3v4" />
      <Path d="M4 11h16" />
      <Path d="M10.5 14h3l-2 4" />
    </Svg>
  );
}

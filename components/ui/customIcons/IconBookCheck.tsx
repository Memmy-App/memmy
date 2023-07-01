import React from "react";
import Svg, { Path } from "react-native-svg";
import { type TablerIconsProps } from "tabler-icons-react-native";

// eslint-disable-next-line import/prefer-default-export
export function IconBookCheck({
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
      <Path
        d="M12 19C10.6318 18.21 9.07983 17.7942 7.5 17.7942C5.92017 17.7942 4.36817 18.21 3 19V5.99996C4.36817 5.21005 5.92017 4.79419 7.5 4.79419C9.07983 4.79419 10.6318 5.21005 12 5.99996M12 19V5.99996M12 19C12.7358 18.5752 13.5247 18.2586 14.3425 18.0566M12 5.99996C13.3682 5.21005 14.9202 4.79419 16.5 4.79419C18.0798 4.79419 19.6318 5.21005 21 5.99996V12.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 17L19 19L23 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

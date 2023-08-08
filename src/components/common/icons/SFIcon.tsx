import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SFSymbol, SymbolScale, SymbolWeight } from "react-native-sfsymbols";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface IProps {
  icon: string;
  weight?: SymbolWeight;
  scale?: SymbolScale;
  size?: number;
  boxSize?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export function SFIcon({
  icon,
  weight = "semibold",
  scale = "large",
  size = 16,
  boxSize = 24,
  style = { width: 24, height: 24 },
  color,
}: IProps): React.JSX.Element {
  const theme = useThemeOptions();

  return (
    <SFSymbol
      color={color || theme.colors.accent}
      name={icon}
      weight={weight}
      scale={scale}
      size={size}
      resizeMode="center"
      multicolor={false}
      // @ts-expect-error - can spread style but TS complains about it
      style={{ ...style, width: boxSize, height: boxSize }}
    />
  );
}

export default React.memo(SFIcon);

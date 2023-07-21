import { useTheme } from "native-base";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SFSymbol, SymbolScale, SymbolWeight } from "react-native-sfsymbols";

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
}: IProps) {
  const theme = useTheme();

  return (
    <SFSymbol
      color={color || theme.colors.app.accent}
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

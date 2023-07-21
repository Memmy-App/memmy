import { IconPlanet } from "tabler-icons-react-native";
import React from "react";
import { useTheme } from "native-base";

export function PlanetIcon({ size, color }: { size?: number; color?: string }) {
  const theme = useTheme();
  return <IconPlanet color={color || theme.colors.app.accent} size={size} />;
}

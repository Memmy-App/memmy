import { IconPlanet } from "tabler-icons-react-native";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

export function PlanetIcon({ size, color }: { size?: number; color?: string }) {
  const theme = useThemeOptions();
  return <IconPlanet color={color || theme.colors.accent} size={size} />;
}

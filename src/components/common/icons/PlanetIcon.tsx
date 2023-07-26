import { IconPlanet } from "tabler-icons-react-native";
import React from "react";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

export function PlanetIcon({ size, color }: { size?: number; color?: string }) {
  const theme = useAppSelector(selectThemeOptions);
  return <IconPlanet color={color || theme.colors.accent} size={size} />;
}

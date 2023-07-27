import React from "react";
import { VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface Props {
  children: React.ReactNode;
}

export function Post({ children }: Props) {
  const theme = useThemeOptions();

  return <VStack backgroundColor={theme.colors.fg}>{children}</VStack>;
}

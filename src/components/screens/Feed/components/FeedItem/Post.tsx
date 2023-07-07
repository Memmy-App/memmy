import React from "react";
import { VStack, useTheme } from "native-base";

interface Props {
  children: React.ReactNode;
}

export function Post({ children }: Props) {
  const theme = useTheme();

  return <VStack backgroundColor={theme.colors.app.fg}>{children}</VStack>;
}

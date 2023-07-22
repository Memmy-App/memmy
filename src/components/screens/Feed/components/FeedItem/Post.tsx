import React from "react";
import { useTheme } from "native-base";
import { VStack } from "@components/common/Gluestack";

interface Props {
  children: React.ReactNode;
}

export function Post({ children }: Props) {
  const theme = useTheme();

  return <VStack backgroundColor={theme.colors.app.fg}>{children}</VStack>;
}

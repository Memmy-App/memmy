import React from "react";
import { VStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface Props {
  children: React.ReactNode;
}

export function Post({ children }: Props) {
  const theme = useAppSelector(selectThemeOptions);

  return <VStack backgroundColor={theme.colors.fg}>{children}</VStack>;
}

import React from "react";
import { HStack } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

function ButtonGroup({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <HStack
      backgroundColor={theme.colors.fg}
      borderRadius="$3xl"
      mx="$4"
      mb="$2"
    >
      {children}
    </HStack>
  );
}

export default ButtonGroup;

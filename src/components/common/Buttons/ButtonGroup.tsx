import React from "react";
import { HStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

function ButtonGroup({ children }: { children: React.ReactNode }) {
  const theme = useThemeOptions();

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

import React from "react";
import { HStack, useTheme } from "native-base";

function ButtonGroup({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <HStack
      backgroundColor={theme.colors.app.fg}
      borderRadius={20}
      mx={4}
      mb={2}
    >
      {children}
    </HStack>
  );
}

export default ButtonGroup;

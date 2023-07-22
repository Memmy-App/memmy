import React from "react";
import { useTheme } from "native-base";
import { HStack } from "@components/common/Gluestack";

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

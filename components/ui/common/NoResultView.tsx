import React from "react";
import { Text, useTheme, VStack } from "native-base";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";

export interface INoResultViewProps extends InterfaceVStackProps {
  message?: string;
}

function NoResultView({ message, ...rest }: INoResultViewProps) {
  const theme = useTheme();

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" {...rest}>
      <Text
        fontStyle="italic"
        color={theme.colors.app.textSecondary}
        textAlign="center"
      >
        {message || "No results found :("}
      </Text>
    </VStack>
  );
}

export default NoResultView;

import React from "react";
import { Center, Spinner, Text } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface LoadingFooterProps {
  message?: string;
}

function LoadingFooter({ message = "Loading..." }: LoadingFooterProps) {
  const theme = useThemeOptions();

  return (
    <Center my="$4">
      <Spinner />
      <Text fontStyle="italic" color={theme.colors.textSecondary}>
        {message}
      </Text>
    </Center>
  );
}

export default LoadingFooter;

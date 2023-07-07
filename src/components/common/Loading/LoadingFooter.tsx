import React from "react";
import { Center, Spinner, Text, useTheme } from "native-base";

interface LoadingFooterProps {
  message?: string;
}

function LoadingFooter({ message = "Loading..." }: LoadingFooterProps) {
  const theme = useTheme();

  return (
    <Center my={4}>
      <Spinner />
      <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
        {message}
      </Text>
    </Center>
  );
}

export default LoadingFooter;

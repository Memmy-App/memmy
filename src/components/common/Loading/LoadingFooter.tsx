import React from "react";
import { useTheme } from "native-base";
import { Center, Spinner, Text } from "@components/common/Gluestack";

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

import React from "react";
import { Center, Pressable, Text, useTheme } from "native-base";

interface LoadingErrorFooterProps {
  onRetryPress: () => void | Promise<void>;
  message: string;
}

function LoadingErrorFooter({
  onRetryPress,
  message,
}: LoadingErrorFooterProps) {
  const theme = useTheme();

  return (
    <Center flex={1} my={4}>
      <Text fontStyle="italic" color={theme.colors.app.secondaryText}>
        {`${message || "Error loading content :("}`}
      </Text>
      <Pressable
        onPress={onRetryPress}
        borderColor="blue.500"
        borderWidth={1}
        borderRadius={5}
        padding={1}
        mt={2}
      >
        <Text color="blue.500">Retry</Text>
      </Pressable>
    </Center>
  );
}

export default LoadingErrorFooter;

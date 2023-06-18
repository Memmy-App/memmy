import React from "react";
import { Center, Spinner, Text } from "native-base";

interface LoadingFooterProps {
  message?: string;
}

function LoadingFooter({ message = "Loading..." }: LoadingFooterProps) {
  return (
    <Center my={4}>
      <Spinner />
      <Text fontStyle="italic" color="gray.500">
        {message}
      </Text>
    </Center>
  );
}

export default LoadingFooter;

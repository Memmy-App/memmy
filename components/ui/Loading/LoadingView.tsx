import React from "react";
import { Spinner, VStack } from "native-base";

function LoadingView() {
  return (
    <VStack flex={1} justifyContent="center" backgroundColor="screen.800">
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

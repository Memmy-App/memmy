import React from "react";
import { Spinner, useTheme, VStack } from "native-base";

function LoadingView() {
  const theme = useTheme();

  return (
    <VStack
      flex={1}
      justifyContent="center"
      backgroundColor={theme.colors.app.backgroundSecondary}
    >
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

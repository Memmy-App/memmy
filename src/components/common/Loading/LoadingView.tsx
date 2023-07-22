import React from "react";
import { useTheme } from "native-base";
import { Spinner, VStack } from "@components/common/Gluestack";

function LoadingView() {
  const theme = useTheme();

  return (
    <VStack
      flex={1}
      justifyContent="center"
      backgroundColor={theme.colors.app.bg}
    >
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

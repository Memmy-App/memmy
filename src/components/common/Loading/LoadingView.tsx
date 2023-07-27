import React from "react";
import { Spinner, VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

function LoadingView() {
  const theme = useThemeOptions();

  return (
    <VStack flex={1} justifyContent="center" backgroundColor={theme.colors.bg}>
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

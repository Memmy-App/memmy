import React from "react";
import { Spinner, VStack } from "@src/components/gluestack";
import { useThemeOptions } from "@src/state/settings/settingsStore";

function LoadingView(): React.JSX.Element {
  const theme = useThemeOptions();

  return (
    <VStack flex={1} justifyContent="center" backgroundColor={theme.colors.bg}>
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

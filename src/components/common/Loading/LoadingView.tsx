import React from "react";
import { Spinner, VStack } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

function LoadingView() {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <VStack flex={1} justifyContent="center" backgroundColor={theme.colors.bg}>
      <Spinner size="large" />
    </VStack>
  );
}

export default LoadingView;

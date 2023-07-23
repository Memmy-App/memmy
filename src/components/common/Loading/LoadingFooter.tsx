import React from "react";
import { Center, Spinner, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface LoadingFooterProps {
  message?: string;
}

function LoadingFooter({ message = "Loading..." }: LoadingFooterProps) {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <Center my="$4">
      <Spinner />
      <Text fontStyle="italic" color={theme.colors.textSecondary}>
        {message}
      </Text>
    </Center>
  );
}

export default LoadingFooter;

import React from "react";
import { Text } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface IProps {
  children: string;
}

function ItalicText({ children }: IProps) {
  const theme = useThemeOptions();

  return (
    <Text py="$3" color={theme.colors.textSecondary} fontStyle="italic">
      {children}
    </Text>
  );
}

export default ItalicText;

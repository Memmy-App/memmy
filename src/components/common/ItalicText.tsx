import React from "react";
import { Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface IProps {
  children: string;
}

function ItalicText({ children }: IProps) {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <Text py="$3" color={theme.colors.textSecondary} fontStyle="italic">
      {children}
    </Text>
  );
}

export default ItalicText;

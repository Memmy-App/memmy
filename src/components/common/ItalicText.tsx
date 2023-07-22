import React from "react";
import { useTheme } from "native-base";
import { Text } from "@components/common/Gluestack";

interface IProps {
  children: string;
}

function ItalicText({ children }: IProps) {
  const theme = useTheme();

  return (
    <Text py={3} color={theme.colors.app.textSecondary} fontStyle="italic">
      {children}
    </Text>
  );
}

export default ItalicText;

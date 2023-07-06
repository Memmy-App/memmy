import { useTheme } from "native-base";
import React from "react";
import { IconBookCheck } from "../customIcons/IconBookCheck";

interface Props {
  isRead: boolean;
}

export function IsReadIndicator({ isRead }: Props) {
  const { colors } = useTheme();

  if (isRead) {
    return <IconBookCheck color={colors.app.accent} size={20} />;
  }

  return null;
}

export default {
  IsReadIndicator: React.memo(IsReadIndicator),
};

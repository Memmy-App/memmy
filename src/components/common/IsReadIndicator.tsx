import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { IconBookCheck } from "./icons/IconBookCheck";

interface Props {
  isRead: boolean;
}

export function IsReadIndicator({ isRead }: Props) {
  const { colors } = useThemeOptions();

  if (isRead) {
    return <IconBookCheck color={colors.accent} size={20} />;
  }

  return null;
}

export default {
  IsReadIndicator: React.memo(IsReadIndicator),
};

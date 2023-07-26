import React from "react";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { IconBookCheck } from "./icons/IconBookCheck";

interface Props {
  isRead: boolean;
}

export function IsReadIndicator({ isRead }: Props) {
  const { colors } = useAppSelector(selectThemeOptions);

  if (isRead) {
    return <IconBookCheck color={colors.accent} size={20} />;
  }

  return null;
}

export default {
  IsReadIndicator: React.memo(IsReadIndicator),
};

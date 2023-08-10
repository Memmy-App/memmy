import React from "react";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface Props {
  isRead: boolean;
}

export function ReadIndicator({ isRead }: Props): React.JSX.Element | null {
  const { colors } = useThemeOptions();

  if (isRead) {
    return <SFIcon icon={ICON_MAP.BOOK} />;
  }

  return null;
}

export default React.memo(ReadIndicator);

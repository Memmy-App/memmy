import React from "react";
import {
  useSettings,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import { Fab } from "@src/components/common/Gluestack";
import { ICON_MAP } from "@src/constants/IconMap";
import { SFIcon } from "@src/components/common/icons/SFIcon";

interface IProps {
  onPress: () => void;
  onLongPress: () => void;
}

function NextCommentFAB({ onPress, onLongPress }: IProps) {
  const theme = useThemeOptions();
  const settings = useSettings();

  return (
    <Fab
      backgroundColor={theme.colors.accent}
      p="$2"
      onPress={onPress}
      onLongPress={onLongPress}
      placement={settings.commentJumpPlacement}
    >
      <SFIcon icon={ICON_MAP.CHEVRON.DOWN} color="#fff" size={14} />
    </Fab>
  );
}

export default NextCommentFAB;

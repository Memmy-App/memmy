import { Fab } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

interface IProps {
  onPress: () => void;
}

function HideReadFAB({ onPress }: IProps) {
  const theme = useThemeOptions();

  return (
    <Fab
      backgroundColor={theme.colors.accent}
      p="$2"
      onPress={onPress}
      placement="bottom right"
    >
      <SFIcon icon={ICON_MAP.HIDE} color="#fff" size={14} />
    </Fab>
  );
}

export default HideReadFAB;

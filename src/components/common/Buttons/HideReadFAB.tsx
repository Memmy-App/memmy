import { Fab } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

interface IProps {
  onPress: () => void;
}

function HideReadFAB({ onPress }: IProps) {
  const theme = useAppSelector(selectThemeOptions);

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

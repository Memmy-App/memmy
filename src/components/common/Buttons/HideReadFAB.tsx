import { Fab, useTheme } from "native-base";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

interface IProps {
  onPress: () => void;
}

function HideReadFAB({ onPress }: IProps) {
  const theme = useTheme();

  return (
    <Fab
      renderInPortal={false}
      shadow={2}
      fontSize="md"
      backgroundColor={theme.colors.app.accent}
      icon={<SFIcon icon={ICON_MAP.HIDE} color="#fff" size={14} />}
      p={2}
      onPress={onPress}
    />
  );
}

export default HideReadFAB;

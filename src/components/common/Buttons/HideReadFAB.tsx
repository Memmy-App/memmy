import { useTheme } from "native-base";
import { Fab } from "@components/common/Gluestack";
import React from "react";
import SFIcon from "../icons/SFIcon";

interface IProps {
  onPress: () => void;
}

function HideReadFAB({ onPress }: IProps) {
  const theme = useTheme();

  return (
    <Fab
      backgroundColor={theme.colors.app.accent}
      p="$2"
      onPress={onPress}
      placement="bottom right"
    >
      <SFIcon icon="eye.slash" color="#fff" size={14} />
    </Fab>
  );
}

export default HideReadFAB;

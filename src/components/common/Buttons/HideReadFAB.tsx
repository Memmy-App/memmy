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
      renderInPortal={false}
      shadow={2}
      fontSize="$md"
      backgroundColor={theme.colors.app.accent}
      icon={<SFIcon icon="eye.slash" color="#fff" size={14} />}
      p="$2"
      onPress={onPress}
    />
  );
}

export default HideReadFAB;

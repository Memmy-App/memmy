import { Fab, useTheme } from "native-base";
import React from "react";
import { IconChevronDown } from "tabler-icons-react-native";

interface IProps {
  onPress: () => void;
  onLongPress: () => void;
}

function NextCommentFAB({ onPress, onLongPress }: IProps) {
  const theme = useTheme();

  return (
    <Fab
      renderInPortal={false}
      shadow={2}
      fontSize="md"
      backgroundColor={theme.colors.app.accent}
      icon={<IconChevronDown size={24} color="#ffffff" />}
      p={2}
      onPress={onPress}
    />
  );
}

export default NextCommentFAB;

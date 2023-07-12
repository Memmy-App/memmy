import React from "react";
import Animated, { FadeOutDown, FadeInDown } from "react-native-reanimated";
import { useTheme, Fab } from "native-base";
import { IconEyeOff } from "tabler-icons-react-native";

interface IProps {
  onPress: () => void;
}

function HideReadFAB({ onPress }: IProps) {
  const theme = useTheme();

  return (
    <Animated.View
      exiting={FadeOutDown.duration(500)}
      entering={FadeInDown.duration(500)}
      style={{ zIndex: 100 }}
    >
      <Fab
        renderInPortal={false}
        shadow={2}
        fontSize="md"
        backgroundColor={theme.colors.app.accent}
        icon={<IconEyeOff size={24} color="#ffffff" />}
        p={2}
        onPress={onPress}
      />
    </Animated.View>
  );
}

export default HideReadFAB;

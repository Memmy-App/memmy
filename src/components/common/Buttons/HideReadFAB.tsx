import React from "react";
import Animated, { FadeOutDown, FadeInDown } from "react-native-reanimated";
import { FAB } from "react-native-elements";
import { useTheme } from "native-base";

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
      <FAB
        placement="right"
        size="large"
        color={theme.colors.app.accent}
        icon={{ name: "eye-with-line", type: "entypo" }}
        onPress={onPress}
      />
    </Animated.View>
  );
}

export default HideReadFAB;

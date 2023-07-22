import { Box, HStack, Pressable, Text } from "native-base";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { ColorType } from "native-base/lib/typescript/components/types";
import { IFontSize } from "native-base/lib/typescript/theme/base/typography";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface IconButtonWithTextProps {
  onPressHandler?: (event: GestureResponderEvent) => void;
  icon: JSX.Element;
  iconBgColor?: ColorType;
  text?: string | number;
  textColor?: string;
  textSize?: IFontSize;
}

function IconButtonWithText({
  onPressHandler,
  icon,
  iconBgColor,
  text,
  textColor,
  textSize = "lg",
}: IconButtonWithTextProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(1.4, { duration: 250 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 250 });
  };

  return (
    <Pressable
      onPress={onPressHandler}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={5}
    >
      <HStack space={2} alignItems="center">
        <Animated.View style={animatedStyle}>
          <Box borderRadius={5} backgroundColor={iconBgColor} padding={0.5}>
            {icon}
          </Box>
        </Animated.View>
        {text !== undefined && (
          <Text color={textColor} fontSize={textSize}>
            {text}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default React.memo(IconButtonWithText);

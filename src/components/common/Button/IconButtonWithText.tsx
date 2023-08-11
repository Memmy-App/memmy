import React, { useCallback } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureResponderEvent, Pressable } from "react-native";
import { Box, HStack, Text } from "@src/components/gluestack";
import { SFIcon } from "@src/components/common/icons/SFIcon";

interface IProps {
  icon: string;
  onPress?: (e: GestureResponderEvent) => unknown;
  iconSize?: number;
  iconColor?: string;
  iconBgColor?: string;
  text?: string;
  textColor?: string;
  size?: React.ComponentProps<typeof Text>["size"];
}

function IconButtonWithText({
  icon,
  iconSize,
  iconColor,
  iconBgColor,
  onPress,
  text,
  textColor,
  size,
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withTiming(1.4, { duration: 250 });
  }, []);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 250 });
  }, []);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={5}
    >
      <HStack space="sm" alignItems="center">
        <Animated.View style={animatedStyle}>
          <Box borderRadius="$md" padding="$0.5" backgroundColor={iconBgColor}>
            <SFIcon icon={icon} size={iconSize} color={iconColor} />
          </Box>
        </Animated.View>
        {text !== undefined && (
          <Text color={textColor} size={size}>
            {text}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default React.memo(IconButtonWithText);

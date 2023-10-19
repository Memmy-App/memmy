import React, { NamedExoticComponent, useCallback } from 'react';
import { styled, View } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { playHaptic } from '@helpers/haptics';

interface IProps {
  icon: NamedExoticComponent;
  iconSize?: number;
  color?: string;
  onPress?: () => unknown | Promise<unknown>;
  backgroundColor?: string;
}

function AnimatedIconButton({
  icon,
  iconSize,
  color,
  onPress,
  backgroundColor,
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const Icon = styled(icon, {
    // @ts-expect-error - this is valid
    size: iconSize,
    color: color ?? '$accent',
  });

  const onButtonPress = useCallback(() => {
    if (onPress == null) return;

    void playHaptic();
    onPress();
  }, [onPress]);

  const onTapBegin = (): void => {
    'worklet';

    scale.value = withTiming(1.2, { duration: 200 });
  };

  const onTapEnd = (): void => {
    'worklet';

    scale.value = withTiming(1, { duration: 200 });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={onTapBegin}
      onPressOut={onTapEnd}
      onPress={onButtonPress}
    >
      <Animated.View style={[scaleStyle]}>
        <View backgroundColor={backgroundColor} borderRadius={3} padding={4}>
          <Icon />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default React.memo(AnimatedIconButton);

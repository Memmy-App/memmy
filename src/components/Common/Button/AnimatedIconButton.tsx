import React, { NamedExoticComponent } from 'react';
import { styled } from 'tamagui';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface IProps {
  icon: NamedExoticComponent;
  iconSize: number;
  color?: string;
  onPress: () => unknown | Promise<unknown>;
}

function AnimatedIconButton({
  icon,
  iconSize,
  color,
  onPress,
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const Icon = styled(icon, {
    // @ts-expect-error - this is valid
    size: iconSize,
    color: color ?? '$accent',
  });

  const onTapBegin = (): void => {
    'worklet';

    scale.value = withTiming(1.2, { duration: 100 });
  };

  const onTapEnd = (): void => {
    'worklet';

    scale.value = withTiming(1, { duration: 100 });

    runOnJS(onPress)();
  };

  const onTapCancel = (): void => {
    'worklet';

    scale.value = withTiming(1, { duration: 100 });
  };

  const tapGesture = Gesture.Tap()
    .onBegin(onTapBegin)
    .onEnd(onTapEnd)
    .onTouchesCancelled(onTapCancel);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[scaleStyle]}>
        <Icon />
      </Animated.View>
    </GestureDetector>
  );
}

export default React.memo(AnimatedIconButton);

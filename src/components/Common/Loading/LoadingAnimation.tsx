import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mouseImage = require('../../../../assets/mouse.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mouseSmallImage = require('../../../../assets/mouseSmall.png');

interface IProps {
  size?: 'normal' | 'small';
}

export default function LoadingAnimation({
  size = 'normal',
}: IProps): React.JSX.Element {
  const scale = useSharedValue(0.7);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.7, { duration: 800 }),
      ),
      -1,
    );
  }, []);

  return (
    <Animated.Image
      source={size === 'normal' ? mouseImage : mouseSmallImage}
      style={animatedStyle}
    />
  );
}

import React, { useCallback, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { playHaptic } from '@helpers/haptics';
import { Text, useTheme, XStack } from 'tamagui';
import { AlertTriangle } from '@tamagui/lucide-icons';

interface IProps {
  nsfw: boolean;
  setNsfw: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NsfwButton({
  nsfw,
  setNsfw,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  const scale = useSharedValue(1);
  const bgColor = useSharedValue(theme.bg.val);

  const onPress = useCallback(() => {
    if (onPress == null) return;

    void playHaptic();
    setNsfw((prev) => !prev);
  }, [nsfw]);

  useEffect(() => {
    if (nsfw) {
      bgColor.value = withTiming('#d73f3f', { duration: 200 });
    } else {
      bgColor.value = withTiming(theme.bg.val, { duration: 200 });
    }
  }, [nsfw]);

  const onPressIn = (): void => {
    'worklet';

    scale.value = withTiming(1.1, { duration: 200 });
  };

  const onPressOut = (): void => {
    'worklet';

    scale.value = withTiming(1, { duration: 200 });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  return (
    <Animated.View style={[scaleStyle]}>
      <Animated.View style={[{ borderRadius: 5, width: 90 }, bgStyle]}>
        <XStack
          flex={1}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          alignItems="center"
          justifyContent="center"
          space="$2"
          paddingVertical={6}
        >
          <AlertTriangle color="$accent" size={19} />
          <Text>NSFW</Text>
        </XStack>
      </Animated.View>
    </Animated.View>
  );
}

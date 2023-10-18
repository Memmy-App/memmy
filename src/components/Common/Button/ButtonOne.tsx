import React, { useCallback, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FontSizeTokens, Text } from 'tamagui';
import HStack from '@components/Common/Stack/HStack';
import { playHaptic } from '@helpers/haptics';
import { Variable } from '@tamagui/web';

interface IProps {
  onPress?: () => unknown;
  label?: string;
  icon?: React.NamedExoticComponent;
  disabled?: boolean;
  fontSize?: Variable<any> | FontSizeTokens;
  backgroundColor?: string;
}

function ButtonOne({
  onPress,
  label,
  icon,
  disabled,
  fontSize = '$3',
  backgroundColor = '$bg',
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const Icon = useMemo(
    () =>
      icon != null
        ? // @ts-expect-error - defining color
          React.createElement(icon, { color: '$accent', size: 16 })
        : null,
    [icon],
  );

  const onButtonPress = useCallback(() => {
    if (onPress == null) return;

    void playHaptic();
    onPress();
  }, [onPress]);

  const onTapBegin = (): void => {
    'worklet';

    scale.value = withTiming(1.1, { duration: 200 });
  };

  const onTapEnd = (): void => {
    'worklet';

    scale.value = withTiming(1, { duration: 200 });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1, flexGrow: 1 }, scaleStyle]}>
      <HStack
        backgroundColor={backgroundColor}
        borderRadius="$2"
        padding="$2"
        onPress={onButtonPress}
        onPressIn={onTapBegin}
        onPressOut={onTapEnd}
        disabled={disabled}
      >
        <HStack space="$2" alignItems="center" flex={1}>
          {Icon}
          <Text fontSize={fontSize} margin="auto">
            {label}
          </Text>
        </HStack>
      </HStack>
    </Animated.View>
  );
}

export default React.memo(ButtonOne);

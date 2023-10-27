import React, { useCallback, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FontSizeTokens, Text, useTheme, XStack } from 'tamagui';
import { playHaptic } from '@helpers/haptics';
import { Variable } from '@tamagui/web';

interface IProps {
  onPress?: () => unknown;
  label?: string;
  icon?: React.NamedExoticComponent;
  isIconFilled?: boolean;
  disabled?: boolean;
  fontSize?: Variable<any> | FontSizeTokens;
  backgroundColor?: string;
  width?: number;
}

function ButtonOne({
  onPress,
  label,
  icon,
  isIconFilled = false,
  disabled,
  fontSize = '$3',
  backgroundColor = '$bg',
  width,
}: IProps): React.JSX.Element {
  const scale = useSharedValue(1);
  const theme = useTheme();

  const Icon = useMemo(
    () =>
      icon != null
        ? React.createElement(icon, {
            // @ts-expect-error - defining color
            color: '$accent',
            size: 20,
            fill: isIconFilled ? theme.accent.val : theme.bg.val,
          })
        : null,
    [icon, isIconFilled],
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
      <XStack
        backgroundColor={backgroundColor}
        borderRadius="$2"
        p="$2"
        onPress={onButtonPress}
        onPressIn={onTapBegin}
        onPressOut={onTapEnd}
        disabled={disabled}
        width={width}
      >
        <XStack space="$2" alignItems="center" flex={1}>
          {Icon}
          <Text fontSize={fontSize} m="auto" numberOfLines={1}>
            {label}
          </Text>
        </XStack>
      </XStack>
    </Animated.View>
  );
}

export default React.memo(ButtonOne);

import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useTheme } from 'tamagui';
import { ChevronDown } from '@tamagui/lucide-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { playHaptic } from '@helpers/haptics';

interface IProps {
  onPress: () => void;
  onLongPress: () => void;
}

export interface FABRef {
  setVisible: (visible: boolean) => void;
}

const FAB = forwardRef<FABRef, IProps>(function fab(
  { onPress, onLongPress }: IProps,
  ref,
): React.JSX.Element {
  const theme = useTheme();

  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  useImperativeHandle(ref, () => ({
    setVisible: (visible: boolean) => {
      buttonOpacity.value = withTiming(visible ? 1 : 0, { duration: 100 });
    },
  }));

  const runAnimations = (): void => {
    'worklet';

    buttonScale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
  };

  const onButtonPress = useCallback(() => {
    void playHaptic();
    runAnimations();
    onPress?.();
  }, [onPress]);

  const onButtonLongPress = useCallback(() => {
    void playHaptic();
    runAnimations();
    onLongPress?.();
  }, [onLongPress]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  return (
    <Animated.View
      style={[styles.fab, { backgroundColor: theme.accent.val }, buttonStyle]}
    >
      <Pressable onPress={onButtonPress} onLongPress={onButtonLongPress}>
        <ChevronDown size={30} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 100,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: 'black',
  },
});

export default React.memo(FAB);

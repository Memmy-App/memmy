import React, { useEffect } from 'react';
import { setToast, useToast } from '@src/state';
import { styled, Text, XStack, YStack } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface IProps {
  translate?: number;
}

export default function AppToast({
  translate = 170,
}: IProps): React.JSX.Element {
  const toast = useToast();

  const toastPosition = useSharedValue(-100);

  const Icon =
    toast?.icon != null
      ? styled(toast.icon, {
          // @ts-expect-error - this is valid
          size: 20,
          color: '$secondary',
        })
      : null;

  useEffect(() => {
    // Do nothing if there is no toast set
    if (toast == null) return;

    // Display the toast
    toastPosition.value = translate;

    // Close the toast after a period of time
    setTimeout(() => {
      toastPosition.value = -100;
    }, toast.duration);

    // Reset the toast when complete
    setTimeout(() => {
      setToast();
    }, toast.duration + 200);
  }, [toast]);

  const toastStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(toastPosition.value, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.toast, toastStyle]}>
      <YStack
        justifyContent="center"
        alignItems="center"
        space="$1.5"
        backgroundColor={toast?.color}
        py="$4"
        px="$2"
        borderRadius="$4"
      >
        {toast?.title != null && (
          <Text fontWeight="$6" fontSize="$5" color="white">
            {toast?.title}
          </Text>
        )}
        <XStack alignItems="center" space="$2">
          {Icon != null && <Icon />}
          <Text fontWeight="$5" fontSize="$3" color="white">
            {toast?.text}
          </Text>
        </XStack>
      </YStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    borderRadius: 15,
    margin: 8,
    padding: 12,
    position: 'absolute',
    right: 10,
    left: 10,
    zIndex: 10,
    top: -100,
  },
});

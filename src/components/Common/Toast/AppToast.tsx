import React, { useEffect } from 'react';
import { useToast } from '@src/state/app/appStore';
import { styled, Text, useTheme } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import VStack from '@components/Common/Stack/VStack';
import { StyleSheet } from 'react-native';
import { setToast } from '@src/state/app/actions';
import HStack from '@components/Common/Stack/HStack';

export default function AppToast(): React.JSX.Element {
  const toast = useToast();
  const theme = useTheme();

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
    if (toast === null) return;

    // Display the toast
    toastPosition.value = 170;

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
    <Animated.View
      style={[styles.toast, { backgroundColor: theme.info.val }, toastStyle]}
    >
      <VStack justifyContent="center" alignItems="center" space="$1.5">
        {toast?.title != null && (
          <Text fontWeight="$6" fontSize="$5">
            {toast?.title}
          </Text>
        )}
        <HStack alignItems="center" space="$2">
          {Icon != null && <Icon />}
          <Text fontWeight="$5" fontSize="$3">
            {toast?.text}
          </Text>
        </HStack>
      </VStack>
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

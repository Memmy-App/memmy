import { HStack, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  ToastVariant,
  hideToast,
  selectToast,
} from "../../slices/toast/toastSlice";
import SFIcon from "./icons/SFIcon";

function Toast(): JSX.Element {
  const { isOpen, message, duration, variant, icon } =
    useAppSelector(selectToast);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemeOptions);

  const positionY = useSharedValue(-100);

  const bgColor = theme.colors[variant];
  const textColor = theme.colors[`${variant}Text`];

  const iconMap: Record<ToastVariant, JSX.Element> = {
    info: <SFIcon color={textColor} icon="checkmark.circle" />,
    success: <SFIcon color={textColor} icon="checkmark.circle" />,
    error: <SFIcon color={textColor} icon="exclamationmark.circle" />,
    warn: <SFIcon color={textColor} icon="exclamationmark.circle" />,
  };

  useEffect(() => {
    if (!isOpen) return;

    if (duration) {
      const timeout = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(positionY.value, {
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

  if (isOpen) {
    positionY.value = 100;
  }

  if (!isOpen) {
    positionY.value = -100;
  }

  return (
    <Animated.View
      style={[
        {
          borderRadius: 8,
          margin: 8,
          padding: 8,
          position: "absolute",
          right: 0,
          left: 0,
          zIndex: 100,
          backgroundColor: bgColor,
          top: 0,
        },
        animatedStyle,
      ]}
    >
      <HStack justifyContent="center" alignItems="center" space="xs">
        {icon || iconMap[variant]}
        <Text color={textColor} fontWeight="semibold" alignContent="center">
          {message}
        </Text>
      </HStack>
    </Animated.View>
  );
}

export default Toast;

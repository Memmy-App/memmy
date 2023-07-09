import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme, Text, HStack } from "native-base";
import { IconAlertCircle, IconCheck } from "tabler-icons-react-native";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  ToastVariant,
  hideToast,
  selectToast,
} from "../../slices/toast/toastSlice";

function Toast(): JSX.Element {
  const { isOpen, message, duration, variant, icon } =
    useAppSelector(selectToast);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const positionY = useSharedValue(-100);

  const bgColor = theme.colors.app[variant!];
  // TODO Fix this later
  // @ts-ignore
  const textColor = theme.colors.app[`${variant}Text`];
  const iconMap: Record<ToastVariant, JSX.Element> = {
    info: <IconCheck color={textColor} />,
    success: <IconCheck color={textColor} />,
    error: <IconAlertCircle color={textColor} />,
    warn: <IconAlertCircle color={textColor} />,
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
      <HStack justifyContent="center" alignItems="center" space={1}>
        {icon || iconMap[variant!]}
        <Text color={textColor} fontWeight="semibold" alignContent="center">
          {message}
        </Text>
      </HStack>
    </Animated.View>
  );
}

export default Toast;

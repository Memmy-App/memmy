import { HStack, Text } from "@src/components/common/Gluestack";
import { useAppDispatch, useAppSelector } from "@root/store";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import {
  hideToast,
  selectToast,
  ToastVariant,
} from "../../slices/toast/toastSlice";
import SFIcon from "./icons/SFIcon";
import { ICON_MAP } from "../../constants/IconMap";

function Toast(): JSX.Element {
  const { isOpen, message, duration, variant, icon } =
    useAppSelector(selectToast);
  const dispatch = useAppDispatch();
  const theme = useThemeOptions();

  const positionY = useSharedValue(-100);

  const bgColor = theme.colors[variant];
  const textColor = theme.colors[`${variant}Text`];

  const iconMap: Record<ToastVariant, JSX.Element> = {
    info: <SFIcon color={textColor} icon={ICON_MAP.TOAST.INFO} />,
    success: <SFIcon color={textColor} icon={ICON_MAP.TOAST.SUCCESS} />,
    error: <SFIcon color={textColor} icon={ICON_MAP.TOAST.ERROR} />,
    warn: <SFIcon color={textColor} icon={ICON_MAP.TOAST.WARN} />,
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

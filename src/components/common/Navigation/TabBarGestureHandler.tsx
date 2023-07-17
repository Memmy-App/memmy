import React, { useCallback } from "react";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { runOnJS } from "react-native-reanimated";

interface IProps {
  children: React.ReactNode;
}

function TabBarGestureHandler({ children }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPanEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (event.translationX < 10) return;

      runOnJS(navigation.pop)();
    },
    []
  );

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .activeOffsetX([-20, 20])
    .hitSlop({ left: -20 })
    .onEnd(onPanEnd);

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
}

export default TabBarGestureHandler;

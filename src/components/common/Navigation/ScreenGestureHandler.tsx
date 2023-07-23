import React, { useCallback } from "react";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";

interface IProps {
  children: React.ReactNode;
}

function ScreenGestureHandler({ children }: IProps) {
  const { swipeToVote } = useAppSelector(selectSettings);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPanEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (swipeToVote) return;

      if (event.translationX < 10 || Math.abs(event.translationY) >= 30) return;

      navigation.pop();
    },
    [swipeToVote]
  );

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .activeOffsetX([-20, 20])
    .cancelsTouchesInView(true)
    .onEnd(onPanEnd);

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
}

export default ScreenGestureHandler;

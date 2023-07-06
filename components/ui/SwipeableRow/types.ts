/* Courtesy https://github.com/beardwin/ */

import { GestureHandlers, SharedValue } from "react-native-reanimated";
import {
  GestureEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import React, { SetStateAction } from "react";

export type SwipeableRowGestureContext = {
  startX: number;
};

export interface Handlers
  extends GestureHandlers<
    Readonly<GestureEventPayload & PanGestureHandlerEventPayload>,
    SwipeableRowGestureContext
  > {}

export interface ISwipeableRowContext {
  translateX: SharedValue<number>;
  setLeftSubscribers: React.Dispatch<SetStateAction<Handlers[]>>;
  setRightSubscribers: React.Dispatch<SetStateAction<Handlers[]>>;
}

export interface ISwipeableColors {
  first: string;
  second: string;
}

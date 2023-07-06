/* Courtesy https://github.com/beardwin/ */

import { GestureHandlers, SharedValue } from "react-native-reanimated";
import {
  GestureEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

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
  subscribe: (handlers: Handlers) => () => void;
}

export interface ISwipeableColors {
  first: string;
  second: string;
}

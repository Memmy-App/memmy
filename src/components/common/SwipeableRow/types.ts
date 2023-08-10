/* Courtesy https://github.com/beardwin/ */
import { SharedValue } from "react-native-reanimated";
import {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

export type SwipeableRowGestureContext = {
  startX: number;
};

export interface Handlers {
  onBegin?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onStart?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEnd?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onFinalize?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onUpdate?: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
}

export interface ISwipeableRowContext {
  translateX: SharedValue<number>;
  subscribe: (handlers: Handlers) => () => void;
}

export interface ISwipeableColors {
  first: string;
  second: string;
}

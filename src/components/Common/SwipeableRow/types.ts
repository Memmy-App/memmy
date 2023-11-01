import {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { SwipeableActionParams } from '@helpers/swipeableActions';
import { IconType } from '@src/types/IconMap';

export interface Handlers {
  onBegin?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onStart?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onEnd?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onFinalize?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onUpdate?: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
}

export interface ISwipeableColors {
  first: string;
  second?: string;
}

export interface ISwipeableOptions {
  actions: ISwipeableActions;
  colors: ISwipeableColors;
  icons: ISwipeableIcons;
}

export interface ISwipeableActions {
  first?: (params: SwipeableActionParams) => unknown;
  second?: (params: SwipeableActionParams) => unknown;
}

export interface ISwipeableIcons {
  first?: IconType;
  second?: IconType;
}

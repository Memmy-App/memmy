import React from "react";
import { Handlers, ISwipeableRowContext } from "./types";

const SwipeableRowContext = React.createContext<ISwipeableRowContext>({
  translateX: { value: 0 },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribe: (_: Handlers) => () => {},
});

export const useSwipeableRow = (): ISwipeableRowContext =>
  React.useContext(SwipeableRowContext);

interface Props extends ISwipeableRowContext {
  children: React.ReactNode;
}

export function SwipeableRowProvider({
  children,
  ...value
}: Props): React.JSX.Element {
  return (
    <SwipeableRowContext.Provider value={value}>
      {children}
    </SwipeableRowContext.Provider>
  );
}

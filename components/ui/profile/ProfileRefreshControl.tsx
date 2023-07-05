import React from "react";
import { RefreshControl } from "react-native";

interface IProps {
  refreshing: boolean;
  doLoad: (refresh: boolean) => Promise<void>;
}

export function ProfileRefreshControl({ refreshing, doLoad }: IProps) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => {
        doLoad(true).then();
      }}
    />
  );
}

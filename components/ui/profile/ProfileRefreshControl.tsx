import React from "react";
import { RefreshControl } from "react-native";
import { useTheme } from "native-base";

interface IProps {
  refreshing: boolean;
  doLoad: (refresh: boolean) => Promise<void>;
}

export function ProfileRefreshControl({ refreshing, doLoad }: IProps) {
  const theme = useTheme();

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => {
        doLoad(true).then();
      }}
      tintColor={theme.colors.app.textSecondary}
    />
  );
}

import React from "react";
import { RefreshControl as RNRefreshControl } from "react-native";
import { useTheme } from "native-base";

interface IProps {
  refreshing: boolean;
  onRefresh: () => void;
}

function RefreshControl({ refreshing, onRefresh }: IProps) {
  const { colors } = useTheme();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.app.textSecondary}
    />
  );
}

export default RefreshControl;

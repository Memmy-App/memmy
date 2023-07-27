import React from "react";
import { RefreshControl as RNRefreshControl } from "react-native";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface IProps {
  refreshing: boolean;
  onRefresh: () => void;
}

function RefreshControl({ refreshing, onRefresh }: IProps) {
  const { colors } = useThemeOptions();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.textSecondary}
    />
  );
}

export default RefreshControl;

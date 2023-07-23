import React from "react";
import { RefreshControl as RNRefreshControl } from "react-native";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface IProps {
  refreshing: boolean;
  onRefresh: () => void;
}

function RefreshControl({ refreshing, onRefresh }: IProps) {
  const { colors } = useAppSelector(selectThemeOptions);

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.textSecondary}
    />
  );
}

export default RefreshControl;

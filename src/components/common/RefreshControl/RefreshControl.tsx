import React from "react";
import { RefreshControl as RNRefreshControl } from "react-native";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface IProps {
  refreshing: boolean;
  onRefresh: () => void;
}

function RefreshControl({ refreshing, onRefresh }: IProps): React.JSX.Element {
  const { colors } = useThemeOptions();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.textSecondary}
    />
  );
}

export default React.memo(RefreshControl);

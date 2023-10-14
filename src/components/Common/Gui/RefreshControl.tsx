import React from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';
import { useTheme } from 'tamagui';

interface IProps {
  refreshing: boolean;
  onRefresh: () => unknown;
}

export default function RefreshControl({
  refreshing,
  onRefresh,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.secondary.val}
    />
  );
}

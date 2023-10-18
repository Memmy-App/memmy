import React from 'react';
import {
  RefreshControl as RNRefreshControl,
  RefreshControlProps,
} from 'react-native';
import { useTheme } from 'tamagui';

interface IProps extends RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => unknown;
}

export default function RefreshControl({
  refreshing,
  onRefresh,
  ...rest
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.secondary.val}
      {...rest}
    />
  );
}

import React from 'react';
import { View } from 'tamagui';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';

export default function LoadingScreen(): React.JSX.Element {
  return (
    <View backgroundColor="$bg" flex={1}>
      <LoadingOverlay visible={true} />
    </View>
  );
}

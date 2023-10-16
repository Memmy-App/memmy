import React from 'react';
import { Spinner, View } from 'tamagui';

export default function SuspenseSpinner(): React.JSX.Element {
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Spinner size="large" color="$secondary" />
    </View>
  );
}

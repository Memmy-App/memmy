import React from 'react';
import { Text, YStack } from 'tamagui';

export default function Feed(): React.JSX.Element {
  return (
    <YStack
      flex={1}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Feed Screen</Text>
    </YStack>
  );
}

import React from 'react';
import { Text } from 'tamagui';
import VStack from '@components/Common/Stack/VStack';

export default function Feed(): React.JSX.Element {
  return (
    <VStack
      flex={1}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Feed Screen</Text>
    </VStack>
  );
}

import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';

interface IProps {
  char: string;
}

function DrawerLabel({ char }: IProps): React.JSX.Element {
  return (
    <VStack
      backgroundColor="$inputbg"
      paddingHorizontal="$2"
      paddingVertical="$1"
    >
      <Text fontSize="$2">{char}</Text>
    </VStack>
  );
}

export default React.memo(DrawerLabel);

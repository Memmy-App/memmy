import React from 'react';
import { Text, YStack } from 'tamagui';

interface IProps {
  char: string;
}

function DrawerLabel({ char }: IProps): React.JSX.Element {
  return (
    <YStack
      backgroundColor="$inputbg"
      paddingHorizontal="$2"
      paddingVertical="$1"
    >
      <Text fontSize="$3">{char}</Text>
    </YStack>
  );
}

export default React.memo(DrawerLabel);

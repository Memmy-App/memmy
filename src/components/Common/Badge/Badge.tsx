import React from 'react';
import { Text, XStack } from 'tamagui';

interface IProps {
  color: string;
  text: string;
}

function Badge({ color, text }: IProps): React.JSX.Element {
  return (
    <XStack backgroundColor={color} borderRadius="$3" py="$1" px="$1.5">
      <Text fontSize="$2">{text}</Text>
    </XStack>
  );
}

export default React.memo(Badge);

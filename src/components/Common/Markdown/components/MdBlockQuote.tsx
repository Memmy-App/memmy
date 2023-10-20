import React from 'react';
import { Text, XStack } from 'tamagui';

interface IProps {
  text: string;
}

export default function MdBlockQuote({ text }: IProps): React.JSX.Element {
  return (
    <XStack
      backgroundColor="$fg"
      padding="$2"
      marginVertical="$1"
      marginHorizontal="$3"
      borderRadius="$2"
      borderLeftWidth="$1"
      borderLeftColor="$upvote"
    >
      <Text color="$color" fontSize="$3" wordWrap="break-word">
        {text}
      </Text>
    </XStack>
  );
}

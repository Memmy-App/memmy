import React from 'react';
import { YStack } from 'tamagui';

interface IProps {
  children: React.ReactNode;
}

export default function Container({ children }: IProps): React.JSX.Element {
  return (
    <YStack
      marginHorizontal="$3"
      marginVertical="$2"
      space="$6"
      paddingTop="$3"
      paddingBottom={100}
    >
      {children}
    </YStack>
  );
}

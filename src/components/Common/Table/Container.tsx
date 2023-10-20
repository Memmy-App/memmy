import React from 'react';
import { YStack } from 'tamagui';

interface IProps {
  children: React.ReactNode;
}

export default function Container({ children }: IProps): React.JSX.Element {
  return (
    <YStack mx="$3" my="$2" space="$6" pt="$3" pb={100}>
      {children}
    </YStack>
  );
}

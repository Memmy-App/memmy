import React from 'react';
import { XStack } from 'tamagui';

interface IProps {
  children: React.ReactNode;
}

export default function FeedItemFooter({
  children,
}: IProps): React.JSX.Element {
  return (
    <XStack px="$3" py="$1" space="$2" alignItems="center">
      {children}
    </XStack>
  );
}

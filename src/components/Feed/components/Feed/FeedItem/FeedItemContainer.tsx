import React from 'react';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  children: React.ReactNode;
}

export default function FeedItemContainer({
  children,
}: IProps): React.JSX.Element {
  return (
    <VStack backgroundColor="$fg" paddingVertical="$2">
      {children}
    </VStack>
  );
}

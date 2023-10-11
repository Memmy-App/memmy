import React from 'react';
import HStack from '@components/Common/Stack/HStack';

interface IProps {
  children: React.ReactNode;
}

export default function FeedItemFooter({
  children,
}: IProps): React.JSX.Element {
  return (
    <HStack
      paddingHorizontal="$3"
      paddingVertical="$1"
      space="$2"
      alignItems="center"
    >
      {children}
    </HStack>
  );
}

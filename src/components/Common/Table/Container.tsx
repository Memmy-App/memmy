import React from 'react';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  children: React.ReactNode;
}

export default function Container({ children }: IProps): React.JSX.Element {
  return (
    <VStack
      marginHorizontal="$3"
      marginVertical="$2"
      space="$6"
      paddingTop="$3"
      paddingBottom={100}
    >
      {children}
    </VStack>
  );
}

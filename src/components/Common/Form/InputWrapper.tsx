import React from 'react';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  children: React.ReactNode;
}

export default function InputWrapper({ children }: IProps): React.JSX.Element {
  return <VStack space="$1">{children}</VStack>;
}

import React from 'react';
import { YStack } from 'tamagui';

interface IProps {
  children: React.ReactNode;
}

export default function InputWrapper({ children }: IProps): React.JSX.Element {
  return <YStack space="$1">{children}</YStack>;
}

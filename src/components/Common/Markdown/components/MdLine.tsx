import React from 'react';
import { MdToken } from '@src/types';
import { Text } from 'tamagui';

interface IProps {
  token: MdToken;
  children?: React.ReactNode;
}

export default function MdLine({ token, children }: IProps): React.JSX.Element {
  return (
    <Text mb="$2" fontSize="$3" textBreakStrategy="simple">
      {children}
    </Text>
  );
}

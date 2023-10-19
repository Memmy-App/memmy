import React from 'react';
import { MdToken } from '@src/types';
import { View } from 'tamagui';

interface IProps {
  token: MdToken;
  children?: React.ReactNode;
}

export default function MdImageWrapper({
  token,
  children,
}: IProps): React.JSX.Element {
  return <View marginBottom="$2">{children}</View>;
}

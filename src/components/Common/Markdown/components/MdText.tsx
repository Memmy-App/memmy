import React from 'react';
import { MdToken } from '@src/types';
import { Text } from 'tamagui';

interface IProps {
  token: MdToken;
  style?: object;
}

export default function MdText({ token, style }: IProps): React.JSX.Element {
  return (
    <Text color="$color" style={style}>
      {token.content}
    </Text>
  );
}

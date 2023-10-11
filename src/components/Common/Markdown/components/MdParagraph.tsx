import React from 'react';
import { MdToken } from '@src/types';
import P1 from '@components/Common/Text/P1';

interface IProps {
  token: MdToken;
}

export default function MdParagraph({ token }: IProps): React.JSX.Element {
  return <P1>{token.content}</P1>;
}

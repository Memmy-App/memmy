import React from 'react';
import { MdToken } from '@src/types';
import { Text } from 'tamagui';
import MdLink from '@components/Common/Markdown/components/MdLink';

interface IProps {
  token: MdToken;
  style?: object;
  link?: boolean;
  href?: string;
  color: string;
}

export default function MdText({
  token,
  style,
  link,
  href,
  color,
}: IProps): React.JSX.Element {
  if (link === true) {
    return <MdLink token={token} href={href ?? ''} />;
  }

  return (
    <Text
      style={style}
      fontSize="$3"
      wordWrap="break-word"
      color={color}
      textBreakStrategy="simple"
    >
      {token.content}
    </Text>
  );
}

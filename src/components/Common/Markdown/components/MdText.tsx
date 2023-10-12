import React from 'react';
import { MdToken } from '@src/types';
import { Text } from 'tamagui';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import MdLink from '@components/Common/Markdown/components/MdLink';

interface IProps {
  token: MdToken;
  style?: object;
  link?: boolean;
  href?: string;
}

export default function MdText({
  token,
  style,
  link,
  href,
}: IProps): React.JSX.Element {
  const fontSize = useSettingsStore((state) => state.fontSize);

  if (link === true) {
    return <MdLink token={token} href={href ?? ''} fontSize={fontSize} />;
  }

  return (
    <Text
      color="$color"
      style={style}
      fontSize={fontSize}
      wordWrap="break-word"
    >
      {token.content}
    </Text>
  );
}

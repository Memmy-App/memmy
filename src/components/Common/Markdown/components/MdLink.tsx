import React, { useCallback } from 'react';
import { MdToken } from '@src/types';
import { openLink } from '@helpers/links';
import { Pressable } from 'react-native';
import { Text } from 'tamagui';

interface IProps {
  token: MdToken;
  href: string;
  fontSize: number;
}

export default function MdLink({
  token,
  href,
  fontSize,
}: IProps): React.JSX.Element {
  const onPress = useCallback(() => {
    openLink(href);
  }, []);

  return (
    <Pressable onPress={onPress}>
      <Text fontSize={fontSize} color="$accent" wordWrap="break-word">
        {token.content}
      </Text>
    </Pressable>
  );
}

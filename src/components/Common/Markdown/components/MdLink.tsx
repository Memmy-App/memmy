import React, { useCallback } from 'react';
import { MdToken } from '@src/types';
import { openLink } from '@helpers/links';
import { Pressable } from 'react-native';
import { Text } from 'tamagui';

interface IProps {
  token: MdToken;
  href: string;
}

export default function MdLink({ token, href }: IProps): React.JSX.Element {
  const onPress = useCallback(() => {
    openLink(href);
  }, []);

  return (
    <Pressable onPress={onPress}>
      <Text fontSize="$3" color="$accent" wordWrap="break-word">
        {token.content}
      </Text>
    </Pressable>
  );
}

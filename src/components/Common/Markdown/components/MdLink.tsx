import React, { useCallback } from 'react';
import { MdToken } from '@src/types';
import { Text, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinkHandler } from '@helpers/links';

interface IProps {
  token: MdToken;
  href: string;
}

export default function MdLink({ token, href }: IProps): React.JSX.Element {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    const handler = new LinkHandler(href, theme.navBarBg.val, navigation);
    void handler.handleLink();
  }, []);

  return (
    <Text
      fontSize="$3"
      color="$accent"
      wordWrap="break-word"
      textBreakStrategy="simple"
      onPress={onPress}
      hitSlop={15}
      textDecorationLine="underline"
    >
      {token.content}
    </Text>
  );
}

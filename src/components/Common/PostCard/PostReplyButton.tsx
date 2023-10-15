import React, { useCallback } from 'react';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Reply } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IProps {
  itemId: number;
}

function PostShareButton({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    navigation.navigate('Reply', { postId: itemId });
  }, [itemId]);

  return (
    <>
      <AnimatedIconButton
        icon={Reply}
        color="$accent"
        iconSize={25}
        onPress={onPress}
      />
    </>
  );
}

export default React.memo(PostShareButton);

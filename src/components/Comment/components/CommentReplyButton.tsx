import React, { useCallback } from 'react';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Reply } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCommentPostId } from '@src/state';

interface IProps {
  itemId: number;
}

function CommentVoteButton({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postId = useCommentPostId(itemId);

  const onPress = useCallback(() => {
    navigation.push('Reply', { commentId: itemId, postId });
  }, [itemId]);

  return (
    <AnimatedIconButton
      icon={Reply}
      color="$accent"
      iconSize={25}
      onPress={onPress}
    />
  );
}

export default React.memo(CommentVoteButton);

import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { Separator, Text, YStack } from 'tamagui';
import { Pressable } from 'react-native';
import { showMoreCommentsNexted } from '@src/state';

interface IProps {
  commentInfo: ICommentInfo;
}

function CommentShowMoreButton({ commentInfo }: IProps): React.JSX.Element {
  const onPress = useCallback(() => {
    showMoreCommentsNexted({
      commentId: commentInfo.commentId,
      postId: commentInfo.postId,
    });
  }, []);

  return (
    <Pressable onPress={onPress}>
      <YStack backgroundColor="$fg">
        <YStack
          ml={commentInfo.depth * 10}
          my="$2"
          borderLeftColor="$secondary"
          borderLeftWidth={2}
          px="$2"
          py="$1"
        >
          <Text color="$secondary" fontStyle="italic" mb="$1" m="auto">
            Show More Comments...
          </Text>
        </YStack>
        <Separator borderColor="$bg" ml={commentInfo.depth * 10 + 10} />
      </YStack>
    </Pressable>
  );
}

export default React.memo(CommentShowMoreButton);

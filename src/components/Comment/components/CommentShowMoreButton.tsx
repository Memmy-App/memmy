import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { Separator, Text, YStack } from 'tamagui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import { Pressable } from 'react-native';

interface IProps {
  commentInfo: ICommentInfo;
}

function CommentShowMoreButton({ commentInfo }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    navigation.push('CommentChain', {
      commentInfo,
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

import React from 'react';
import { useRoute } from '@react-navigation/core';
import { usePostTitle } from '@src/state';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import { Pressable } from 'react-native';
import Ellipsis from '@components/Common/Icons/Ellipsis';

function PostHeader(): React.JSX.Element {
  const { postId } = useRoute<any>().params;
  const postTitle = usePostTitle(postId);
  const theme = useTheme();

  return (
    <YStack
      px="$3"
      pt="$3"
      pb="$2"
      borderBottomWidth={1}
      borderColor="$bg"
      space="$1.5"
    >
      <XStack alignItems="center">
        <PostCommunityLabel itemId={postId} />
        <View ml="auto" p="$1">
          <PostContextMenu itemId={postId}>
            <Pressable hitSlop={5}>
              <Ellipsis size={18} color={theme.accent.val} />
            </Pressable>
          </PostContextMenu>
        </View>
      </XStack>
      <Text fontSize="$5" fontWeight="bold">
        {postTitle}
      </Text>
    </YStack>
  );
}

export default React.memo(PostHeader);

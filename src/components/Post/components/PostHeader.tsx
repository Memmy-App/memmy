import React from 'react';
import { useRoute } from '@react-navigation/core';
import { usePostTitle } from '@src/state';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import { Text, useTheme, View } from 'tamagui';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import { Pressable } from 'react-native';
import Ellipsis from '@components/Common/Icons/Ellipsis';

function PostHeader(): React.JSX.Element {
  const { postId } = useRoute<any>().params;
  const postTitle = usePostTitle(postId);
  const theme = useTheme();

  return (
    <VStack
      paddingHorizontal="$3"
      paddingTop="$3"
      paddingBottom="$2"
      borderBottomWidth={1}
      borderColor="$bg"
      space="$1.5"
    >
      <HStack alignItems="center">
        <PostCommunityLabel itemId={postId} />
        <View marginLeft="auto" padding="$1">
          <PostContextMenu itemId={postId}>
            <Pressable hitSlop={5}>
              <Ellipsis size={18} color={theme.accent.val} />
            </Pressable>
          </PostContextMenu>
        </View>
      </HStack>
      <Text fontSize="$5" fontWeight="bold">
        {postTitle}
      </Text>
    </VStack>
  );
}

export default React.memo(PostHeader);

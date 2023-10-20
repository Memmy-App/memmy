import React from 'react';
import { Text, useTheme, View } from 'tamagui';
import { usePostTitle, useSettingsStore } from '@src/state';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { Pressable } from 'react-native';

interface IProps {
  itemId: number;
}

function FeedItemHeader({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);
  const theme = useTheme();

  const fontWeight = useSettingsStore((state) => state.postTitleWeight);

  return (
    <VStack paddingHorizontal="$3" space="$1.5">
      <HStack alignItems="center">
        <PostCommunityLabel itemId={itemId} />
        <View marginLeft="auto" padding="$1">
          <PostContextMenu itemId={itemId}>
            <Pressable hitSlop={5}>
              <Ellipsis size={18} color={theme.accent.val} />
            </Pressable>
          </PostContextMenu>
        </View>
      </HStack>
      <Text fontSize={18} fontWeight={fontWeight}>
        {postTitle}
      </Text>
    </VStack>
  );
}

export default React.memo(FeedItemHeader);

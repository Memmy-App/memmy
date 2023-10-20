import React from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import { usePostTitle, useSettingsStore } from '@src/state';
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
    <YStack paddingHorizontal="$3" space="$1.5">
      <XStack alignItems="center">
        <PostCommunityLabel itemId={itemId} />
        <View marginLeft="auto" padding="$1">
          <PostContextMenu itemId={itemId}>
            <Pressable hitSlop={5}>
              <Ellipsis size={18} color={theme.accent.val} />
            </Pressable>
          </PostContextMenu>
        </View>
      </XStack>
      <Text fontSize="$5" fontWeight={fontWeight}>
        {postTitle}
      </Text>
    </YStack>
  );
}

export default React.memo(FeedItemHeader);

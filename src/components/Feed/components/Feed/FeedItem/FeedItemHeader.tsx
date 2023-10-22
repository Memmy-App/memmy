import React from 'react';
import { Text, useTheme, XStack, YStack } from 'tamagui';
import { usePostRead, usePostTitle, useSettingsStore } from '@src/state';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { Pressable } from 'react-native';
import { BookOpenCheck } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function FeedItemHeader({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);
  const postRead = usePostRead(itemId);
  const theme = useTheme();

  const fontWeight = useSettingsStore((state) => state.postTitleWeight);

  return (
    <YStack px="$3" py="$1" space="$1.5">
      <XStack alignItems="center">
        <PostCommunityLabel itemId={itemId} />
        <XStack ml="auto" p="$1" pr="$2" space="$3">
          {postRead && (
            <BookOpenCheck
              color="$accent"
              size={20}
              style={{ marginVertical: -1 }}
            />
          )}
          <PostContextMenu itemId={itemId}>
            <Pressable hitSlop={5}>
              <Ellipsis size={18} color={theme.accent.val} />
            </Pressable>
          </PostContextMenu>
        </XStack>
      </XStack>
      <Text fontSize="$5" fontWeight={fontWeight}>
        {postTitle}
      </Text>
    </YStack>
  );
}

export default React.memo(FeedItemHeader);

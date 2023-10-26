import React from 'react';
import { useTheme, XStack } from 'tamagui';
import PostContextMenu from '@components/Common/ContextMenu/components/PostContextMenu';
import { Pressable } from 'react-native';
import Ellipsis from '@components/Common/Icons/Ellipsis';

interface IProps {
  itemId: number;
}

function PostContextButton({ itemId }: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <XStack ml="auto" p="$1" pr="$2" space="$3">
      <PostContextMenu itemId={itemId}>
        <Pressable hitSlop={120}>
          <Ellipsis size={18} color={theme.accent.val} />
        </Pressable>
      </PostContextMenu>
    </XStack>
  );
}

export default React.memo(PostContextButton);

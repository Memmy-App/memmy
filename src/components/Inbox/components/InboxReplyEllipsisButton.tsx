import React from 'react';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import InboxReplyContextMenu from '@components/Common/ContextMenu/components/InboxReplyContextMenu';

interface IProps {
  itemId: number;
  commentId: number;
}

export default function InboxReplyEllipsisButton({
  itemId,
  commentId,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <InboxReplyContextMenu itemId={itemId} commentId={itemId}>
      <Pressable>
        <Ellipsis size={16} color={theme.accent.val} />
      </Pressable>
    </InboxReplyContextMenu>
  );
}

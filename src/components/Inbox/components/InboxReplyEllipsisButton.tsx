import React from 'react';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import InboxReplyContextMenu from '@components/Common/ContextMenu/components/InboxReplyContextMenu';

interface IProps {
  itemId: number;
  commentId: number;
  type: 'reply' | 'mention';
}

export default function InboxReplyEllipsisButton({
  itemId,
  commentId,
  type,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <InboxReplyContextMenu itemId={itemId} commentId={commentId} type={type}>
      <Pressable>
        <Ellipsis size={16} color={theme.accent.val} />
      </Pressable>
    </InboxReplyContextMenu>
  );
}

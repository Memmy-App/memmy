import React from 'react';
import { CircleEllipsis } from '@tamagui/lucide-icons';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import CommentContextMenu from '@components/Common/ContextMenu/components/CommentContextMenu';

interface IProps {
  itemId: number;
}

export default function CommentEllipsisButton({
  itemId,
}: IProps): React.JSX.Element {
  return (
    <CommentContextMenu itemId={itemId}>
      <AnimatedIconButton icon={CircleEllipsis} iconSize={16} />
    </CommentContextMenu>
  );
}

import React from 'react';
import { CircleEllipsis } from '@tamagui/lucide-icons';
import ContextMenuButton from '@components/Common/ContextMenu/components/buttons/ContextMenuButton';
import CommunityContextMenu from '@components/Common/ContextMenu/components/CommunityContextMenu';

interface IProps {
  itemId: number;
}

function CommunityContextMenuButton({ itemId }: IProps): React.JSX.Element {
  return (
    <CommunityContextMenu itemId={itemId}>
      <ContextMenuButton icon={CircleEllipsis} color="white" />
    </CommunityContextMenu>
  );
}

export default React.memo(CommunityContextMenuButton);

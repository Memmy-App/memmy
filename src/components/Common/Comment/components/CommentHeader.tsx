import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import CommentUserLabel from '@components/Common/Comment/components/CommentUserLabel';
import { useComment } from '@src/state/comment/commentStore';
import CommentMetrics from '@components/Common/Comment/components/CommentMetrics';
import CommentEllipsisButton from '@components/Common/Comment/components/CommentEllipsisButton';
import { View } from 'tamagui';

interface IProps {
  itemId: number;
}

function CommentHeader({ itemId }: IProps): React.JSX.Element {
  const comment = useComment(itemId);

  return (
    <HStack>
      <CommentUserLabel
        userIcon={comment?.creator.avatar}
        userName={comment?.creator.name}
        userCommunity={comment?.creator.actor_id}
      />
      <CommentMetrics itemId={itemId} />
      <View marginLeft="auto">
        <CommentEllipsisButton itemId={itemId} />
      </View>
    </HStack>
  );
}

export default React.memo(CommentHeader);

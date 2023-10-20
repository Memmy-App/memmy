import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import CommentUserLabel from '@components/Comment/components/CommentUserLabel';
import {
  useCommentCreatorActorId,
  useCommentCreatorAvatar,
  useCommentCreatorName,
} from '@src/state';
import CommentMetrics from '@components/Comment/components/CommentMetrics';
import CommentEllipsisButton from '@components/Comment/components/CommentEllipsisButton';
import { View } from 'tamagui';

interface IProps {
  itemId: number;
}

function CommentHeader({ itemId }: IProps): React.JSX.Element {
  const commentCreatorAvatar = useCommentCreatorAvatar(itemId);
  const commentCreatorName = useCommentCreatorName(itemId);
  const commentCreatorActorId = useCommentCreatorActorId(itemId);

  return (
    <HStack space="$3" alignItems="center" pb="$2">
      <CommentUserLabel
        userIcon={commentCreatorAvatar}
        userName={commentCreatorName}
        userCommunity={commentCreatorActorId}
      />
      <CommentMetrics itemId={itemId} />
      <View marginLeft="auto">
        <CommentEllipsisButton itemId={itemId} />
      </View>
    </HStack>
  );
}

export default React.memo(CommentHeader);

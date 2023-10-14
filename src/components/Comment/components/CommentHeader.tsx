import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import CommentUserLabel from '@components/Comment/components/CommentUserLabel';
import {
  useCommentCreatorAvatar,
  useCommentCreatorName,
} from '@src/state/comment/commentStore';
import CommentMetrics from '@components/Comment/components/CommentMetrics';
import CommentEllipsisButton from '@components/Comment/components/CommentEllipsisButton';
import { View } from 'tamagui';

interface IProps {
  itemId: number;
}

function CommentHeader({ itemId }: IProps): React.JSX.Element {
  const commentCreatorAvatar = useCommentCreatorAvatar(itemId);
  const commentCreatorName = useCommentCreatorName(itemId);

  return (
    <HStack>
      <CommentUserLabel
        userIcon={commentCreatorAvatar}
        userName={commentCreatorName}
        userCommunity=""
      />
      <CommentMetrics itemId={itemId} />
      <View marginLeft="auto">
        <CommentEllipsisButton itemId={itemId} />
      </View>
    </HStack>
  );
}

export default React.memo(CommentHeader);

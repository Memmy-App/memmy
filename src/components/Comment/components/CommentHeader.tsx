import React from 'react';
import CommentUserLabel from '@components/Comment/components/CommentUserLabel';
import { View, XStack } from 'tamagui';

interface IProps {
  creatorAvatar: string | undefined;
  userName: string | undefined;
  userCommunity: string | undefined;
  EllipsisButton: () => React.JSX.Element;
  CommentMetrics: () => React.JSX.Element;
  isAdmin?: boolean;
  isOp?: boolean;
}

function CommentHeader({
  creatorAvatar,
  userCommunity,
  userName,
  EllipsisButton,
  CommentMetrics,
  isAdmin,
  isOp,
}: IProps): React.JSX.Element {
  return (
    <XStack space="$2.5" alignItems="center" pb="$2">
      <CommentUserLabel
        userIcon={creatorAvatar}
        userName={userName}
        userCommunity={userCommunity}
        isAdmin={isAdmin}
        isOp={isOp}
      />
      <CommentMetrics />
      <View ml="auto" mr="$2.5">
        <EllipsisButton />
      </View>
    </XStack>
  );
}

export default React.memo(CommentHeader);

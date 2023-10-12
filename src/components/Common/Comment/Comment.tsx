import React, { useMemo } from 'react';
import { useCommentContent } from '@src/state/comment/commentStore';
import VStack from '@components/Common/Stack/VStack';
import CommentHeader from '@components/Common/Comment/components/CommentHeader';
import CommentContent from '@components/Common/Comment/components/CommentContent';

interface IProps {
  itemId: number;
  depth?: number;
}

const depthToColor = (depth: number): string => {
  switch (depth) {
    case 0:
      return '$color';
    case 1:
      return '$comments-1';
    case 2:
      return '$comments-2';
    case 3:
      return '$comments-3';
    case 4:
      return '$comments-4';
    case 5:
      return '$comments-5';
    default:
      return '$comments-5';
  }
};

function Comment({ itemId, depth = 0 }: IProps): React.JSX.Element {
  const commentContent = useCommentContent(itemId);

  const borderWidth = useMemo(() => (depth > 0 ? 2 : 0), [depth]);
  const borderColor = useMemo(() => depthToColor(depth), [depth]);

  return (
    <VStack marginVertical="$1" backgroundColor="$fg">
      <VStack
        marginLeft={depth * 10}
        marginVertical="$1"
        borderLeftColor={borderColor}
        borderLeftWidth={borderWidth}
        paddingHorizontal="$2"
        paddingVertical="$1"
      >
        <CommentHeader itemId={itemId} />
        <CommentContent itemId={itemId} />
      </VStack>
    </VStack>
  );
}

export default React.memo(Comment);

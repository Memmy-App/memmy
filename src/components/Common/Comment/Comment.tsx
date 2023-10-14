import React, { useMemo } from 'react';
import VStack from '@components/Common/Stack/VStack';
import CommentHeader from '@components/Common/Comment/components/CommentHeader';
import CommentContent from '@components/Common/Comment/components/CommentContent';
import { Pressable } from 'react-native';

interface IProps {
  itemId: number;
  depth?: number;
  onPress?: () => unknown | Promise<unknown>;
  collapsed?: boolean;
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

function Comment({
  itemId,
  depth = 0,
  onPress,
  collapsed = false,
}: IProps): React.JSX.Element {
  const borderWidth = useMemo(() => (depth > 0 ? 2 : 0), [depth]);
  const borderColor = useMemo(() => depthToColor(depth), [depth]);

  if (onPress != null) {
    return <PressableComment itemId={itemId} depth={depth} onPress={onPress} />;
  }

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
        {!collapsed && <CommentContent itemId={itemId} />}
      </VStack>
    </VStack>
  );
}

export const PressableComment = React.memo(function pressableComment({
  itemId,
  depth = 0,
  onPress,
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <Comment itemId={itemId} depth={depth} />
    </Pressable>
  );
});

export default React.memo(Comment);

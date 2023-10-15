import React, { useMemo } from 'react';
import VStack from '@components/Common/Stack/VStack';
import CommentHeader from '@components/Comment/components/CommentHeader';
import CommentContent from '@components/Comment/components/CommentContent';
import { Pressable } from 'react-native';
import { Separator } from 'tamagui';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { useCommentGesturesEnabled } from '@src/state/settings/settingsStore';
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';
import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions';
import { useCommentPostId } from '@src/state/comment/commentStore';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { ISwipeableOptions } from '@components/Common/SwipeableRow/types';

interface IProps {
  itemId: number;
  depth?: number;
  onPress?: () => unknown | Promise<unknown>;
  collapsed?: boolean;
  leftOptions?: ISwipeableOptions;
  rightOptions?: ISwipeableOptions;
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
  leftOptions,
  rightOptions,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postId = useCommentPostId(itemId);
  const swipesEnabled = useCommentGesturesEnabled();

  const borderWidth = useMemo(() => (depth > 0 ? 2 : 0), [depth]);
  const borderColor = useMemo(() => depthToColor(depth), [depth]);

  const actionParams = useMemo<SwipeableActionParams>(
    () => ({
      postId,
      commentId: itemId,
      navigation,
    }),
    [itemId],
  );

  return (
    <SwipeableRow
      leftOption={
        swipesEnabled && leftOptions?.actions.first != null ? (
          <LeftOptions options={leftOptions} actionParams={actionParams} />
        ) : undefined
      }
      rightOption={
        swipesEnabled && rightOptions?.actions.first != null ? (
          <RightOptions options={rightOptions} actionParams={actionParams} />
        ) : undefined
      }
    >
      <VStack backgroundColor="$fg">
        <VStack
          marginLeft={depth * 10}
          marginVertical="$2"
          borderLeftColor={borderColor}
          borderLeftWidth={borderWidth}
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <CommentHeader itemId={itemId} />
          {!collapsed && <CommentContent itemId={itemId} />}
        </VStack>
        <Separator borderColor="$bg" marginLeft={depth * 10 + 10} />
      </VStack>
    </SwipeableRow>
  );
}

export const PressableComment = React.memo(function pressableComment({
  itemId,
  depth = 0,
  onPress,
  collapsed = false,
  leftOptions,
  rightOptions,
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <Comment
        itemId={itemId}
        depth={depth}
        collapsed={collapsed}
        leftOptions={leftOptions}
        rightOptions={rightOptions}
      />
    </Pressable>
  );
});

export default React.memo(Comment);
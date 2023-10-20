import React, { useCallback, useMemo, useRef } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICommentInfo } from '@src/types';
import { usePostCommentsInfo } from '@src/state';
import { FlatList, ListRenderItemInfo } from 'react-native';
import CommentChain from '@components/Comment/components/CommentChain';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useAwaitTransition } from '@hooks/useAwaitTransition';
import { YStack } from 'tamagui';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function CommentChainScreen({
  route,
}: IProps): React.JSX.Element {
  const params = route.params;
  const commentInfo = params.commentInfo as ICommentInfo;

  const commentsInfo = usePostCommentsInfo(commentInfo.postId);

  const flashListRef = useRef<FlatList<ICommentInfo>>();

  const awaitTransition = useAwaitTransition();

  const commentsToShow = useMemo(
    () =>
      !awaitTransition.transitioning
        ? commentsInfo?.filter((item) =>
            item.path.includes(commentInfo.parentId!.toString()),
          )
        : [],
    [awaitTransition.transitioning],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ICommentInfo>): React.JSX.Element => {
      return <CommentChain commentInfo={item} ignoreLoadMore />;
    },
    [],
  );

  return (
    <YStack flex={1} backgroundColor="$bg">
      <FlatList<ICommentInfo>
        renderItem={renderItem}
        data={commentsToShow}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={300}
        windowSize={10}
        ListEmptyComponent={
          <FeedLoadingIndicator loading={awaitTransition.transitioning} />
        }
        // @ts-expect-error - This is valid
        ref={flashListRef}
      />
    </YStack>
  );
}

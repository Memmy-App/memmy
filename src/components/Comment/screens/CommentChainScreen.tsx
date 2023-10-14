import React, { useCallback, useMemo } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VStack from '@components/Common/Stack/VStack';
import { ICommentInfo } from '@src/types';
import { usePostCommentsInfo } from '@src/state/post/postStore';
import { FlatList, ListRenderItemInfo } from 'react-native';
import CommentChain from '@components/Comment/components/CommentChain';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function CommentChainScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const params = route.params;
  const commentInfo = params.commentInfo as ICommentInfo;

  const commentsInfo = usePostCommentsInfo(commentInfo.postId);

  const commentsToShow = useMemo(
    () =>
      commentsInfo?.filter((item) =>
        item.path.includes(commentInfo.parentId!.toString()),
      ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ICommentInfo>): React.JSX.Element => {
      return <CommentChain commentInfo={item} ignoreLoadMore />;
    },
    [],
  );

  return (
    <VStack flex={1} backgroundColor="$bg">
      <FlatList
        renderItem={renderItem}
        data={commentsToShow}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={300}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </VStack>
  );
}

import React, { useCallback, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  usePostCommentsInfo,
  usePostLoaded,
  usePostTitle,
} from '@src/state/post/postStore';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import VStack from '@components/Common/Stack/VStack';
import Post from '@components/Post/components/Post';
import instance from '@api/Instance';
import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Comment/components/CommentChain';
import { FlatList, ViewToken } from 'react-native';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useSharedValue } from 'react-native-reanimated';

interface RenderItem {
  item: ICommentInfo;
}

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function PostScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { postId } = route.params;

  const postLoaded = usePostLoaded(postId);
  const postTitle = usePostTitle(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const { isLoading, isError } = useLoadData(async () => {
    return await instance.getComments(postId);
  });

  useEffect(() => {
    navigation.setOptions({
      title: postTitle,
    });
  }, [postTitle]);

  const renderItem = useCallback(({ item }: RenderItem): React.JSX.Element => {
    return <CommentChain commentInfo={item} viewableItems={viewableItems} />;
  }, []);

  if (!postLoaded) return <LoadingScreen />;

  return (
    <VStack flex={1}>
      <FlatList
        renderItem={renderItem}
        data={postCommentsInfo}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={300}
        windowSize={10}
        removeClippedSubviews={true}
        ListHeaderComponent={<Post />}
        ListEmptyComponent={
          <FeedLoadingIndicator loading={isLoading} error={isError} />
        }
      />
    </VStack>
  );
}

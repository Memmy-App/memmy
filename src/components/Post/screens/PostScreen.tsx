import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  usePostCommentsInfo,
  usePostLoaded,
  usePostTitle,
} from '@src/state/post/postStore';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import VStack from '@components/Common/Stack/VStack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Post from '@components/Post/components/Post';
import { useQuery } from '@tanstack/react-query';
import instance from '@api/Instance';
import { ICommentInfo } from '@src/types';
import { Spinner } from 'tamagui';
import CommentChain from '@components/Common/Comment/CommentChain';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const renderItem = (
  item: ListRenderItemInfo<ICommentInfo>,
): React.JSX.Element => {
  return <CommentChain commentInfo={item.item} />;
};

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function PostScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { postId } = route.params;

  const postLoaded = usePostLoaded(postId);
  const postTitle = usePostTitle(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);

  const { isLoading } = useQuery(['post', postId], async () => {
    return await instance.getComments(postId);
  });

  useEffect(() => {
    navigation.setOptions({
      title: postTitle,
    });
  }, [postTitle]);

  if (!postLoaded) return <LoadingScreen />;

  return (
    <VStack flex={1}>
      <FlashList<ICommentInfo>
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={postCommentsInfo}
        ListHeaderComponent={<Post />}
        ListEmptyComponent={<Spinner />}
        estimatedItemSize={500}
      />
    </VStack>
  );
}

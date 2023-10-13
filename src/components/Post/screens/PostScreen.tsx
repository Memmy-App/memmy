import React, { useEffect } from 'react';
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
import { Spinner } from 'tamagui';
import CommentChain from '@components/Common/Comment/CommentChain';
import { FlatList } from 'react-native';
import { useLoadData } from '@hooks/useLoadData';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

interface RenderItem {
  item: ICommentInfo;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <CommentChain commentInfo={item} />;
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

  const { isLoading } = useLoadData(async () => {
    return await instance.getPost(postId);
  });

  useEffect(() => {
    navigation.setOptions({
      title: postTitle,
    });
  }, [postTitle]);

  if (!postLoaded) return <LoadingScreen />;

  return (
    <VStack flex={1}>
      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={postCommentsInfo}
        ListHeaderComponent={<Post />}
        ListEmptyComponent={<Spinner />}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
      />
    </VStack>
  );
}

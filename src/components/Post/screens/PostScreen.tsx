import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePostLoaded, usePostTitle } from '@src/state/post/postStore';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import VStack from '@components/Common/Stack/VStack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Post from '@components/Post/components/Post';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const renderItem = (item: ListRenderItemInfo<number>): React.JSX.Element => {
  return <></>;
};

const keyExtractor = (item: number): string => item.toString();

export default function PostScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { postId } = route.params;

  const postLoaded = usePostLoaded(postId);
  const postTitle = usePostTitle(postId);

  useEffect(() => {
    navigation.setOptions({
      title: postTitle,
    });
  }, [postTitle]);

  // First we should check if the post is in the store

  if (!postLoaded) return <LoadingScreen />;

  return (
    <VStack flex={1}>
      <FlashList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<Post />}
      />
    </VStack>
  );
}

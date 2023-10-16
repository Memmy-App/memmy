import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  usePostCommentsInfo,
  usePostCounts,
  usePostLoaded,
} from '@src/state/post/postStore';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import VStack from '@components/Common/Stack/VStack';
import Post from '@components/Post/components/Post';
import instance from '@src/Instance';
import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Comment/components/CommentChain';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { FlashList } from '@shopify/flash-list';
import { CommentSortType } from 'lemmy-js-client';
import { useDefaultCommentSort } from '@src/state/settings/settingsStore';
import { stripEss } from '@helpers/text';
import CommentSortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/CommentSortTypeContextMenuButton';
import { useNewCommentId } from '@src/state/app/appStore';
import { setNewCommentId } from '@src/state/app/actions';

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
  const postCounts = usePostCounts(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);

  const newCommentId = useNewCommentId();

  const defaultSortType = useDefaultCommentSort();

  const [sortType, setSortType] = useState<CommentSortType>(
    defaultSortType ?? 'Top',
  );

  const flashListRef = useRef<FlashList<ICommentInfo>>();

  const postsToShow = useMemo(() => {
    return postCommentsInfo?.filter((commentInfo) => commentInfo.showInPost);
  }, [postCommentsInfo]);

  const { isLoading, isError } = useLoadData(async () => {
    return await instance.getComments(postId);
  });

  useEffect(() => {
    navigation.setOptions({
      title: `${postCounts?.comments} ${stripEss(
        postCounts?.comments,
        'Comments',
      )}`,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CommentSortTypeContextMenuButton
          sortType={sortType}
          setSortType={setSortType}
        />
      ),
    });
  }, [sortType]);

  useEffect(() => {
    if (newCommentId == null) return;

    const index = postsToShow?.findIndex((c) => c.commentId === newCommentId);

    if (index == null || index === -1) return;

    flashListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 80,
    });

    setNewCommentId(undefined);
  }, [newCommentId, postsToShow]);

  const renderItem = useCallback(({ item }: RenderItem): React.JSX.Element => {
    return <CommentChain commentInfo={item} />;
  }, []);

  if (!postLoaded) return <LoadingScreen />;

  return (
    <VStack flex={1}>
      <FlashList<ICommentInfo>
        renderItem={renderItem}
        data={postsToShow}
        keyExtractor={keyExtractor}
        estimatedItemSize={100}
        ListHeaderComponent={<Post />}
        ListEmptyComponent={
          <FeedLoadingIndicator loading={isLoading} error={isError} />
        }
        ref={flashListRef}
      />
    </VStack>
  );
}

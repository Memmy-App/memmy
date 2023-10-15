import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoadData } from '@hooks/useLoadData';
import instance from '@src/Instance';
import {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
} from 'lemmy-js-client';
import { orderSearch } from '@helpers/search';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import CommunitySearchResult from '@components/Search/components/CommunitySearchResult';
import PersonSearchResult from '@components/Search/components/PersonSearchResult';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { cleanupPosts } from '@helpers/state';
import { addPosts } from '@src/state/post/actions';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { addComments } from '@src/state/comment/actions';
import Comment from '@components/Comment/components/Comment';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

type ResultType = 'All' | 'Communities' | 'Posts' | 'Users' | 'Comments';
type ResponseType = CommunityView | PersonView | PostView | CommentView;

const getItemType = (item: ResponseType): ResultType => {
  if ((item as PersonView).counts.post_score != null) {
    return 'Users';
  } else if ((item as CommentView).comment != null) {
    return 'Comments';
  } else if ((item as PostView).post != null) {
    return 'Posts';
  } else {
    return 'Communities';
  }
};

const renderItem = ({
  item,
}: ListRenderItemInfo<ResponseType>): React.JSX.Element => {
  const itemType = getItemType(item);

  switch (itemType) {
    case 'Communities':
      return <CommunitySearchResult view={item as CommunityView} />;
    case 'Users':
      return <PersonSearchResult view={item as PersonView} />;
    case 'Posts':
      return <FeedItem itemId={(item as PostView).post.id} />;
    case 'Comments':
      return <Comment itemId={(item as CommentView).comment.id} />;
  }
};

const keyExtractor = (item: ResponseType, index: number): string => {
  return index.toString();
};

export default function SearchResultsScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { key, params } = route;
  const { searchValue } = params;

  const [nextPage, setNextPage] = useState(1);

  const [resultType, setResultType] = useState<ResultType>('All');

  const { isLoading, isError, append, data } = useLoadData<ResponseType[]>(
    async (): Promise<ResponseType[]> => {
      const res = await instance.search({
        q: searchValue,
        page: 1,
        sort: 'TopAll',
        listing_type: 'All',
        type_: resultType,
      });

      if (res === undefined) {
        return [];
      }

      if (res.posts.length > 0) {
        addPosts(res.posts, key);
      }

      if (res.comments.length > 0) {
        addComments(res.comments);
      }

      const before = [
        ...res.posts,
        ...res.users,
        ...res.communities,
        ...res.communities,
      ];

      return orderSearch(before, searchValue);
    },
    undefined,
    setNextPage,
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: searchValue,
    });

    return () => {
      cleanupPosts(key);
    };
  }, []);

  const onEndReached = useCallback(() => {
    append(async () => {
      const res = await instance.search({
        q: searchValue,
        page: nextPage,
        sort: 'TopAll',
        listing_type: 'All',
        type_: resultType,
      });

      if (res === undefined) {
        return [];
      }

      if (res.posts.length > 0) {
        addPosts(res.posts, key);
      }

      if (res.comments.length > 0) {
        addComments(res.comments);
      }

      const before = [
        ...res.posts,
        ...res.users,
        ...res.communities,
        ...res.communities,
      ];

      return orderSearch(before, searchValue);
    });
  }, [resultType, nextPage]);

  return (
    <FlashList
      renderItem={renderItem}
      data={data}
      getItemType={getItemType}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      estimatedItemSize={150}
      ListFooterComponent={
        <FeedLoadingIndicator loading={isLoading} error={isError} />
      }
    />
  );
}

import React, { useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme, VStack } from "native-base";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView, SearchType } from "lemmy-js-client";
import useSearchResult from "../../hooks/search/useSearchResult";
import CompactFeedItem from "../../ui/Feed/CompactFeedItem/CompactFeedItem";
import FeedItem from "../../ui/Feed/FeedItem/FeedItem";
import { useAppSelector } from "../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import LoadingView from "../../ui/Loading/LoadingView";
import SearchUserItem from "../../ui/search/SearchUserItem";
import MCell from "../../ui/table/MCell";
import MTable from "../../ui/table/MTable";
import SearchCommunityItem from "../../ui/search/SearchCommunityItem";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function SearchResultsScreen({ route, navigation }: IProps) {
  const type = route.params.type as SearchType;

  const theme = useTheme();
  const search = useSearchResult(route.params.query, route.params.type);

  const { compactView } = useAppSelector(selectSettings);

  const recycled = useRef({});

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (compactView) {
        return <CompactFeedItem post={item} />;
      }

      return <FeedItem post={item} setPosts={() => {}} recycled={recycled} />;
    },
    []
  );

  if (search.loading) {
    return <LoadingView />;
  }

  return (
    <VStack backgroundColor={theme.colors.app.bg} flex={1}>
      {(type === "Posts" && (
        <FlashList
          data={search.result.posts}
          renderItem={renderItem}
          estimatedItemSize={compactView ? 200 : 600}
        />
      )) ||
        (type === "Users" && (
          <ScrollView px={4}>
            <MTable header="Users">
              {search.result.users.map((u) => (
                <SearchUserItem user={u} />
              ))}
            </MTable>
          </ScrollView>
        )) || (
          <ScrollView px={4}>
            <MTable header="Communities">
              {search.result.communities.map((c) => (
                <SearchCommunityItem community={c} />
              ))}
            </MTable>
          </ScrollView>
        )}
    </VStack>
  );
}

export default SearchResultsScreen;

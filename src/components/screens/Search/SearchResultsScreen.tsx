import React, { useEffect, useRef } from "react";
import { ScrollView, useTheme, VStack } from "native-base";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView, SearchType } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import useSearchResult from "../../../hooks/search/useSearchResult";
import CompactFeedItem from "../Feed/components/CompactFeedItem/CompactFeedItem";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import LoadingView from "../../common/Loading/LoadingView";
import SearchUserItem from "../../common/Search/SearchUserItem";
import MTable from "../../common/Table/MTable";
import SearchCommunityItem from "../../common/Search/SearchCommunityItem";
import NoResultView from "../../common/NoResultView";
import { FeedItem } from "../Feed/components/FeedItem";
import removeFeed from "../../../stores/feeds/actions/removeFeed";
import { useFeedPosts, useFeedStatus } from "../../../stores/feeds/feedsStore";
import addFeed from "../../../stores/feeds/actions/addFeed";

interface IProps {
  route: any;
}

function SearchResultsScreen({ route }: IProps) {
  const { key } = useRoute();

  const posts = useFeedPosts(key);
  const postsStatus = useFeedStatus(key);

  const type = route.params.type as SearchType;

  const { t } = useTranslation();
  const theme = useTheme();
  const search = useSearchResult(route.params.query, route.params.type);

  const { compactView } = useAppSelector(selectSettings);

  const recycled = useRef({});

  useEffect(() => {
    if (type === "Posts") addFeed(key);

    return () => {
      removeFeed(key);
    };
  }, []);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (compactView) {
        return <CompactFeedItem postId={item.post.id} />;
      }

      return <FeedItem postId={item.post.id} recycled={recycled} />;
    },
    []
  );

  if (
    search.loading ||
    (type === "Posts" && (!postsStatus || postsStatus.loading))
  ) {
    return <LoadingView />;
  }

  if (
    !search.result ||
    (search?.result?.communities?.length < 1 &&
      search?.result?.users?.length < 1 &&
      search?.result?.posts?.length < 1 &&
      posts?.length < 1)
  ) {
    return <NoResultView type="search" />;
  }

  return (
    <VStack backgroundColor={theme.colors.app.bg} flex={1}>
      {(type === "Posts" && (
        <FlashList
          data={posts}
          renderItem={renderItem}
          estimatedItemSize={compactView ? 200 : 600}
          ListEmptyComponent={<NoResultView type="search" />}
        />
      )) ||
        (type === "Users" && (
          <ScrollView px={4}>
            <MTable header={t("Users")}>
              {search.result.users.map((u) => (
                <SearchUserItem key={u.person.id} user={u} />
              ))}
            </MTable>
          </ScrollView>
        )) ||
        (type === "Communities" && (
          <ScrollView px={4}>
            <MTable header={t("Communities")}>
              {search.result.communities.map((c) => (
                <SearchCommunityItem key={c.community.id} community={c} />
              ))}
            </MTable>
          </ScrollView>
        ))}
    </VStack>
  );
}

export default SearchResultsScreen;

import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { SearchType } from "lemmy-js-client";
import useSearch from "../../hooks/search/useSearch";
import SearchBar from "../../ui/search/SearchBar";
import ButtonTwo from "../../ui/buttons/ButtonTwo";
import SearchResultTypeHeader from "../../ui/search/SearchResultTypeHeader";
import GenericSearchResult from "../../ui/search/GenericSearchResult";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import LoadingView from "../../ui/Loading/LoadingView";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const search = useSearch();
  const theme = useTheme();

  useEffect(() => {
    console.log(search.searchType);
    console.log(search.result);
  }, [search]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
      <SearchBar
        searchValue={search.query}
        onSearchChange={search.setQuery}
        onSubmitSearch={() => search.doSearch(SearchType.All)}
      />
      <HStack px={4} py={4} space={2}>
        <ButtonTwo
          onPress={() => search.doSearch(SearchType.Communities)}
          text="Communities"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(SearchType.Posts)}
          text="Posts"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(SearchType.Users)}
          text="Users"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(SearchType.All)}
          text="All"
          selectable
        />
      </HStack>
      <ScrollView>
        <VStack px={6}>
          {(search.error && <Text>Search Error</Text>) ||
            (search.loading && <LoadingView />) ||
            (!search.loading &&
              !search.error &&
              search.result &&
              search.result.communities.length === 0 &&
              search.result.posts.length === 0 &&
              search.result.users.length === 0 && (
                <Text fontSize="xl" fontWeight="semibold" textAlign="center">
                  No results found.
                </Text>
              )) ||
            (search.searchType === "All" && search.result && (
              <>
                {search.result.communities.length > 0 && (
                  <>
                    <SearchResultTypeHeader type={SearchType.Communities} />
                    {search.result.communities.map((r) => (
                      <GenericSearchResult
                        header={r.community.name}
                        footer={getBaseUrl(r.community.actor_id)}
                        side={`${r.counts.subscribers} subscribers`}
                        image={r.community.icon}
                        onPress={() =>
                          navigation.navigate("Community", {
                            communityName: r.community.name,
                            actorId: r.community.actor_id,
                            communityFullName: getCommunityFullName(r),
                          })
                        }
                      />
                    ))}
                  </>
                )}
                {search.result.users.length > 0 && (
                  <>
                    <SearchResultTypeHeader type={SearchType.Users} />
                    {search.result.users.length > 0 &&
                      search.result.users.map((r) => (
                        <GenericSearchResult
                          header={r.person.name}
                          footer={getBaseUrl(r.person.actor_id)}
                          side={`${r.counts.post_count} posts`}
                          image={r.person.avatar}
                          onPress={() => {}}
                        />
                      ))}
                  </>
                )}
                {search.result.posts.length > 0 && (
                  <>
                    <SearchResultTypeHeader type={SearchType.Posts} />
                    {search.result.posts.length > 0 &&
                      search.result.posts.map((r) => (
                        <GenericSearchResult
                          header={r.post.name}
                          footer={getBaseUrl(r.post.ap_id)}
                          image={r.community.icon}
                          onPress={() => {}}
                        />
                      ))}
                  </>
                )}
              </>
            )) || <Text>Somethjing went wrong.</Text>}
        </VStack>
      </ScrollView>
    </VStack>
  );
}

export default SearchScreen;

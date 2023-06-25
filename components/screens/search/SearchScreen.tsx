import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { PersonView, PostView } from "lemmy-js-client";
import useSearch from "../../hooks/search/useSearch";
import SearchBar from "../../ui/search/SearchBar";
import ButtonTwo from "../../ui/buttons/ButtonTwo";
import SearchResultTypeHeader from "../../ui/search/SearchResultTypeHeader";
import GenericSearchResult from "../../ui/search/GenericSearchResult";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import LoadingView from "../../ui/Loading/LoadingView";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";
import { setPost } from "../../../slices/post/postSlice";
import { useAppDispatch } from "../../../store";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const search = useSearch();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const onPostPress = (post: PostView) => {
    dispatch(setPost(post));
    navigation.push("Post");
  };

  const onUserPress = (person: PersonView) => {
    navigation.push("UserProfile", {
      fullUsername: `${person.person.name}@${getBaseUrl(
        person.person.actor_id
      )}`,
    });
  };

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <SearchBar
        searchValue={search.query}
        onSearchChange={search.setQuery}
        onSubmitSearch={() => search.doSearch("All")}
      />
      <HStack px={4} py={4} space={2}>
        <ButtonTwo
          onPress={() => search.doSearch("Communities")}
          text="Communities"
        />
        <ButtonTwo onPress={() => search.doSearch("Posts")} text="Posts" />
        <ButtonTwo onPress={() => search.doSearch("Users")} text="Users" />
        <ButtonTwo onPress={() => search.doSearch("All")} text="All" />
      </HStack>
      <ScrollView px={6}>
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
          (search.result && (
            <>
              {search.result.communities.length > 0 && (
                <>
                  <SearchResultTypeHeader type="Communities" />
                  {search.result.communities.map((r) => (
                    <GenericSearchResult
                      key={r.community.id}
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
                  <SearchResultTypeHeader type="Users" />
                  {search.result.users.length > 0 &&
                    search.result.users.map((r) => (
                      <GenericSearchResult
                        key={r.person.id}
                        header={r.person.name}
                        footer={getBaseUrl(r.person.actor_id)}
                        side={`${r.counts.post_count} posts`}
                        image={r.person.avatar}
                        onPress={() => {
                          onUserPress(r);
                        }}
                      />
                    ))}
                </>
              )}
              {search.result.posts.length > 0 && (
                <>
                  <SearchResultTypeHeader type="Posts" />
                  {search.result.posts.length > 0 &&
                    search.result.posts.map((r) => (
                      <GenericSearchResult
                        key={r.post.id}
                        header={r.post.name}
                        footer={getBaseUrl(r.post.ap_id)}
                        image={r.community.icon}
                        onPress={() => {
                          onPostPress(r);
                        }}
                      />
                    ))}
                </>
              )}
            </>
          )) || <Text fontSize="xl" fontWeight="semibold" textAlign="center" />}
      </ScrollView>
    </VStack>
  );
}

export default SearchScreen;

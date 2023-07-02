import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PersonView, PostView } from "lemmy-js-client";
import { HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";
import { setPost } from "../../../slices/post/postSlice";
import { useAppDispatch } from "../../../store";
import useSearch from "../../hooks/search/useSearch";
import CustomButton from "../../ui/buttons/CustomButton";
import LoadingView from "../../ui/Loading/LoadingView";
import GenericSearchResult from "../../ui/search/GenericSearchResult";
import SearchBar from "../../ui/search/SearchBar";
import SearchResultTypeHeader from "../../ui/search/SearchResultTypeHeader";
import SearchBox from "../../ui/search/SearchBox";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const search = useSearch();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => (
        <SearchBox
          query={search.query}
          setQuery={search.setQuery}
          autoFocus={false}
          inHeader
        />
      ),
    });
  }, []);

  const onPostPress = (post: PostView) => {
    dispatch(setPost(post));
    navigation.push("Post");
  };

  const onUserPress = (person: PersonView) => {
    navigation.push("Profile", {
      fullUsername: `${person.person.name}@${getBaseUrl(
        person.person.actor_id
      )}`,
    });
  };

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <SearchBar
        query={search.query}
        setQuery={search.setQuery}
        onSubmit={() => search.doSearch("All")}
      />
      <HStack px={4} py={4} space={2}>
        <CustomButton
          onPress={() => search.doSearch("Communities")}
          text="Communities"
          size="sm"
        />
        <CustomButton
          onPress={() => search.doSearch("Posts")}
          text="Posts"
          size="sm"
        />
        <CustomButton
          onPress={() => search.doSearch("Users")}
          text="Users"
          size="sm"
        />
        <CustomButton
          onPress={() => search.doSearch("All")}
          text="All"
          size="sm"
        />
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

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme, VStack } from "native-base";
import React, { useCallback, useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import useSearch from "../../../hooks/search/useSearch";
import SearchBox from "../../common/Search/SearchBox";
import SearchOptionsList from "../../common/Search/SearchOptionsList";
import SearchTrendingList from "../../common/Search/SearchTrendingList";
import { getBaseUrl } from "../../../helpers/LinkHelper";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { key } = useRoute();

  const search = useSearch();
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => (
        <SearchBox
          query={search.query}
          setQuery={search.setQuery}
          inHeader
          autoFocus
        />
      ),
    });
  }, [search.query]);

  const onCommunitiesPress = useCallback(() => {
    if (search.query.includes("@")) {
      const parts = search.query.split("@");

      if (parts.length === 2) {
        navigation.push("Community", {
          communityFullName: search.query,
          communityName: parts[0],
          actorId: getBaseUrl(parts[1]),
        });

        return;
      }
    }

    navigation.push("Results", {
      type: "Communities",
      query: search.query,
    });
  }, [search.query]);

  const onPostsPress = useCallback(() => {
    navigation.push("Results", {
      key,
      type: "Posts",
      query: search.query,
    });
  }, [search.query]);

  const onUsersPress = useCallback(() => {
    if (search.query.includes("@")) {
      const parts = search.query.split("@");

      if (parts.length === 2) {
        navigation.push("Profile", {
          fullUsername: search.query,
        });

        return;
      }
    }

    navigation.push("Results", {
      type: "Users",
      query: search.query,
    });
  }, [search.query]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <ScrollView px={4} keyboardShouldPersistTaps="handled">
        {!search.query ? (
          <SearchTrendingList communities={search.trending} />
        ) : (
          <SearchOptionsList
            options={{
              onCommunitiesPress,
              onPostsPress,
              onUsersPress,
            }}
          />
        )}
      </ScrollView>
    </VStack>
  );
}

export default SearchScreen;

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import useSearch from "../../hooks/search/useSearch";
import SearchBox from "../../ui/search/SearchBox";
import SearchOptionsList from "../../ui/search/SearchOptionsList";
import SearchTrendingList from "../../ui/search/SearchTrendingList";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
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

  const onCommunitiesPress = () => {
    navigation.push("Results", {
      type: "Communities",
      query: search.query,
    });
  };

  const onPostsPress = () => {
    navigation.push("Results", {
      type: "Posts",
      query: search.query,
    });
  };

  const onUsersPress = () => {
    navigation.push("Results", {
      type: "Users",
      query: search.query,
    });
  };

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

import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, useTheme, VStack } from "native-base";
import { SearchType } from "lemmy-js-client";
import useSearch from "../../hooks/search/useSearch";
import useSearchBar from "../../hooks/search/useSearchBar";
import SearchBar from "../../ui/search/SearchBar";
import ButtonTwo from "../../ui/buttons/ButtonTwo";

function SearchScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const search = useSearch();
  const searchBar = useSearchBar();
  const theme = useTheme();

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.backgroundPrimary}>
      <SearchBar
        searchValue={searchBar.value}
        onSearchChange={searchBar.setValue}
      />
      <HStack px={4} py={4} space={2}>
        <ButtonTwo
          onPress={() =>
            search.doSearch(searchBar.value, SearchType.Communities)
          }
          text="Communities"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(searchBar.value, SearchType.Posts)}
          text="Posts"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(searchBar.value, SearchType.Users)}
          text="Users"
          selectable
        />
        <ButtonTwo
          onPress={() => search.doSearch(searchBar.value, SearchType.All)}
          text="All"
          selectable
        />
      </HStack>
    </VStack>
  );
}

export default SearchScreen;

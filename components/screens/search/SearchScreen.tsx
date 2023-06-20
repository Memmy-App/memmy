import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, useTheme, VStack } from "native-base";
import useSearch from "../../hooks/search/useSearch";
import useSearchBar from "../../hooks/search/useSearchBar";
import SearchBar from "../../ui/search/SearchBar";
import ButtonOne from "../../ui/buttons/ButtonOne";
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
      <HStack px={2.5} py={1.5}>
        <ButtonTwo
          onPress={search.doSearch}
          text="Communities"
          py={1}
          selectable
        />
      </HStack>
    </VStack>
  );
}

export default SearchScreen;

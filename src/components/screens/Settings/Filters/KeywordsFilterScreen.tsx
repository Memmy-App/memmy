import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FilterScreen } from "@src/components/screens/Settings/Filters/FilterScreen";

interface KeywordFilterScreenProps {
  navigation: NativeStackNavigationProp<never, "KeywordFilters">;
}

function KeywordFiltersScreen(props: KeywordFilterScreenProps) {
  return <FilterScreen<never, "KeywordFilters"> type="keyword" {...props} />;
}

export default KeywordFiltersScreen;

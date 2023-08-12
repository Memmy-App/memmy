import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FilterScreen } from "@src/components/screens/Settings/Filters/FilterScreen";

interface IProps {
  navigation: NativeStackNavigationProp<never, "KeywordFilters">;
}

function KeywordFiltersScreen(props: IProps): React.JSX.Element {
  return <FilterScreen<never, "KeywordFilters"> type="keywords" {...props} />;
}

export default KeywordFiltersScreen;

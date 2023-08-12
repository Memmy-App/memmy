import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FilterScreen } from "@src/components/screens/Settings/Filters/FilterScreen";

interface IProps {
  navigation: NativeStackNavigationProp<never, "InstanceFilters">;
}

function InstanceFiltersScreen(props: IProps): React.JSX.Element {
  return <FilterScreen<never, "InstanceFilters"> type="instances" {...props} />;
}

export default InstanceFiltersScreen;

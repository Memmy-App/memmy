import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FilterScreen } from "@src/components/screens/Settings/Filters/FilterScreen";

interface InstancesFilterScreenProps {
  navigation: NativeStackNavigationProp<never, "InstanceFilters">;
}

function InstanceFiltersScreen(props: InstancesFilterScreenProps) {
  return <FilterScreen<never, "InstanceFilters"> type="instance" {...props} />;
}

export default InstanceFiltersScreen;

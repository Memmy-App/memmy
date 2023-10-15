import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import SearchScreen from '@components/Search/screens/SearchScreen';
import SearchResultsScreen from '@components/Search/screens/SearchResultsScreen';

const SearchStack = createNativeStackNavigator();

export default function SearchStackScreen(): React.JSX.Element {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerLargeTitle: true,
        }}
      />
      <SearchStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
      />
      {MainScreens(SearchStack)}
    </SearchStack.Navigator>
  );
}

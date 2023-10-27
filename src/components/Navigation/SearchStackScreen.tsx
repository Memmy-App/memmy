import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import SearchScreen from '@components/Search/screens/SearchScreen';
import SearchResultsScreen from '@components/Search/screens/SearchResultsScreen';
import { useFullWidthSwipes } from '@src/state';

const SearchStack = createNativeStackNavigator();

export default function SearchStackScreen(): React.JSX.Element {
  const fullWidthSwipes = useFullWidthSwipes();

  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: true,
        fullScreenGestureEnabled: fullWidthSwipes,
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

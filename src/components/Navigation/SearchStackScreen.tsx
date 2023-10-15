import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import SearchScreen from '@components/Search/screens/SearchScreen';

const SearchStack = createNativeStackNavigator();

export default function SearchStackScreen(): React.JSX.Element {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <SearchStack.Screen name="Search" component={SearchScreen} />
      {MainScreens(SearchStack)}
    </SearchStack.Navigator>
  );
}

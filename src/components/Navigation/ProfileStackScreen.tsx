import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';

const UserStack = createNativeStackNavigator();

export default function ProfileStackScreen(): React.JSX.Element {
  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
      initialRouteName="Profile"
    >
      {MainScreens(UserStack)}
    </UserStack.Navigator>
  );
}

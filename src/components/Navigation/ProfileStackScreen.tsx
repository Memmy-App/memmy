import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import { useFullWidthSwipes } from '@src/state';

const UserStack = createNativeStackNavigator();

export default function ProfileStackScreen(): React.JSX.Element {
  const fullWidthSwipes = useFullWidthSwipes();

  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: true,
        fullScreenGestureEnabled: fullWidthSwipes,
      }}
      initialRouteName="Profile"
    >
      {MainScreens(UserStack)}
    </UserStack.Navigator>
  );
}

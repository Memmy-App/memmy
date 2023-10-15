import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '@components/User/screens/UserScreen';
import MainScreens from '@components/Navigation/MainScreens';

const UserStack = createNativeStackNavigator();

export default function UserStackScreen(): React.JSX.Element {
  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <UserStack.Screen name="User" component={UserScreen} />
      {MainScreens(UserStack)}
    </UserStack.Navigator>
  );
}

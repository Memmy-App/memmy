import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@components/Profile/screens/ProfileScreen';

const UserStack = createNativeStackNavigator();

export default function UserStackScreen(): React.JSX.Element {
  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <UserStack.Screen name="Profile" component={ProfileScreen} />
    </UserStack.Navigator>
  );
}

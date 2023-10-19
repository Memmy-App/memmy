import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from '@components/Inbox/screens/InboxScreen';
import MainScreens from '@components/Navigation/MainScreens';

const InboxStack = createNativeStackNavigator();

export default function InboxStackScreen(): React.JSX.Element {
  return (
    <InboxStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <InboxStack.Screen name="Inbox" component={InboxScreen} />
      {MainScreens(InboxStack)}
    </InboxStack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from '@components/Inbox/screens/InboxScreen';
import MainScreens from '@components/Navigation/MainScreens';
import { useFullWidthSwipes } from '@src/state';

const InboxStack = createNativeStackNavigator();

export default function InboxStackScreen(): React.JSX.Element {
  const fullWidthSwipes = useFullWidthSwipes();

  return (
    <InboxStack.Navigator
      screenOptions={{
        headerShown: true,
        fullScreenGestureEnabled: fullWidthSwipes,
      }}
    >
      <InboxStack.Screen name="Inbox" component={InboxScreen} />
      {MainScreens(InboxStack)}
    </InboxStack.Navigator>
  );
}

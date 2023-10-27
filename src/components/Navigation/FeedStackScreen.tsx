import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import { useFullWidthSwipes } from '@src/state';

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen(): React.JSX.Element {
  const fullWidthSwipes = useFullWidthSwipes();

  return (
    <FeedStack.Navigator
      screenOptions={{ fullScreenGestureEnabled: fullWidthSwipes }}
    >
      {MainScreens(FeedStack)}
    </FeedStack.Navigator>
  );
}

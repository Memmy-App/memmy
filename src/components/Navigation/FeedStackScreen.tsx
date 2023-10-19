import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen(): React.JSX.Element {
  return <FeedStack.Navigator>{MainScreens(FeedStack)}</FeedStack.Navigator>;
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import MainScreens from '@components/Navigation/MainScreens';

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return <FeedStack.Navigator>{MainScreens(FeedStack)}</FeedStack.Navigator>;
}

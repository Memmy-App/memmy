import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import MainScreens from '@components/Navigation/MainScreens';
import { useScreenOptions } from '@hooks/useScreenOptions';

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const screenOptions = useScreenOptions();

  return (
    <FeedStack.Navigator screenOptions={screenOptions}>
      {MainScreens(FeedStack)}
    </FeedStack.Navigator>
  );
}

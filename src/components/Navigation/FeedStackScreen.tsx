import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreens from '@components/Navigation/MainScreens';
import SubscriptionsScreen from '@components/Subscriptions/screens/SubscriptionsScreen';

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen(): React.JSX.Element {
  return (
    <FeedStack.Navigator>
      {MainScreens(FeedStack)}
      <FeedStack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </FeedStack.Navigator>
  );
}

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FeedStackScreen from '@components/Navigation/FeedStackScreen';
import SettingsStackScreen from '@components/Navigation/SettingsStackScreen';
import { useTheme } from 'tamagui';

const Tab = createBottomTabNavigator();

export default function Tabs(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.fg.val,
        },
        tabBarLabelStyle: {
          color: theme.color.val,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedStackScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

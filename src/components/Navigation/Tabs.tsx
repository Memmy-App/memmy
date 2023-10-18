import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FeedStackScreen from '@components/Navigation/FeedStackScreen';
import SettingsStackScreen from '@components/Navigation/SettingsStackScreen';
import SearchStackScreen from '@components/Navigation/SearchStackScreen';
import InboxStackScreen from '@components/Navigation/InboxStackScreen';
import ProfileStackScreen from '@components/Navigation/ProfileStackScreen';
import { Cog, Home, Inbox, Search, User } from '@tamagui/lucide-icons';
import { EventArg } from '@react-navigation/core';
import { setHomePress } from '@src/state/app/actions/setHomePress';

const Tab = createBottomTabNavigator();

let lastPress = 0;

const onTabPress = (e: EventArg<'tabPress', true, undefined>): void => {
  const now = Date.now();

  if (now < lastPress + 200) {
    setHomePress();
  }

  lastPress = now;
};

export default function Tabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
        listeners={{
          tabPress: onTabPress,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Inbox color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Cog color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

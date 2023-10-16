import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfilePostsTab from '@components/Profile/components/Tabs/ProfilePostsTab';
import ProfileCommentsTab from '@components/Profile/components/Tabs/ProfileCommentsTab';
import ProfileAboutTab from '@components/Profile/components/Tabs/ProfileAboutTab';

const Tabs = createMaterialTopTabNavigator();

export default function ProfileTopTabs(): React.JSX.Element {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Posts" component={ProfilePostsTab} />
      <Tabs.Screen name="Comments" component={ProfileCommentsTab} />
      <Tabs.Screen name="About" component={ProfileAboutTab} />
    </Tabs.Navigator>
  );
}

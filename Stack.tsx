/* eslint react/no-unstable-nested-components: 0 */

import React, { useState } from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { IconBell, IconSearch } from "tabler-icons-react-native";
import FeedsIndexScreen from "./components/screens/feeds/FeedsIndexScreen";
import CommunityFeedScreen from "./components/screens/feeds/CommunityFeedScreen";
import PostScreen from "./components/screens/post/PostScreen";
import NewPostScreen from "./components/screens/post/NewPostScreen";
import SettingsIndexScreen from "./components/screens/settings/SettingsIndexScreen";
import EditAccountScreen from "./components/screens/settings/EditAccountScreen";
import NewCommentScreen from "./components/screens/post/NewCommentScreen";
import OnboardingIndexScreen from "./components/screens/onboarding/OnboardingIndexScreen";
import AddAccountScreen from "./components/screens/onboarding/AddAccountScreen";
import CreateAccountScreen from "./components/screens/onboarding/CreateAccountScreen";
import BookmarksScreen from "./components/screens/userProfile/BookmarksScreen";
import UserProfileScreen from "./components/screens/userProfile/UserProfileScreen";
import SubscriptionsScreen from "./components/screens/userProfile/SubscriptionsScreen";
import { useAppDispatch, useAppSelector } from "./store";
import { loadSettings } from "./slices/settings/settingsActions";
import {
  selectAccounts,
  selectAccountsLoaded,
} from "./slices/accounts/accountsSlice";
import { loadAccounts } from "./slices/accounts/accountsActions";
import BlockedCommunitiesScreen from "./components/screens/userProfile/BlockedCommunitiesScreen";
import ViewAccountsScreen from "./components/screens/settings/ViewAccountsScreen";
import CommunityAboutScreen from "./components/screens/feeds/CommunityAboutScreen";
import SearchScreen from "./components/screens/search/SearchScreen";
import LoadingView from "./components/ui/Loading/LoadingView";
import InboxScreen from "./components/screens/inbox/InboxScreen";
import { selectSite } from "./slices/site/siteSlice";

const FeedStack = createNativeStackNavigator();

function FeedStackScreen() {
  const theme = useTheme();

  return (
    <FeedStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        headerTitleStyle: {
          color: theme.colors.app.primaryText,
        },
      }}
    >
      <FeedStack.Group>
        <FeedStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
          }}
        />
        <FeedStack.Screen name="Post" component={PostScreen} />
        <FeedStack.Screen name="Community" component={CommunityFeedScreen} />
        <FeedStack.Screen
          name="Subscriptions"
          component={SubscriptionsScreen}
        />
        <FeedStack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
            title: "Your Profile",
          }}
        />
      </FeedStack.Group>

      <FeedStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <FeedStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment" }}
        />
        <FeedStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post" }}
        />
        <FeedStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About" }}
        />
      </FeedStack.Group>
    </FeedStack.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();

function InboxStackScreen() {
  const theme = useTheme();

  return (
    <InboxStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        headerTitleStyle: {
          color: theme.colors.app.nativeHeaderTitle,
        },
        freezeOnBlur: true,
      }}
    >
      <InboxStack.Group>
        <InboxStack.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            title: "Inbox",
          }}
        />
        <InboxStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
          }}
        />
        <InboxStack.Screen name="Post" component={PostScreen} />
        <InboxStack.Screen name="Community" component={CommunityFeedScreen} />
        <InboxStack.Screen
          name="Subscriptions"
          component={SubscriptionsScreen}
        />
        <InboxStack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
            title: "Your Profile",
          }}
        />
      </InboxStack.Group>

      <InboxStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <InboxStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment" }}
        />
        <InboxStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post" }}
        />
        <InboxStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About" }}
        />
      </InboxStack.Group>
    </InboxStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  const theme = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        headerTitleStyle: {
          color: theme.colors.app.primaryText,
        },
      }}
    >
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: "Your Profile",
        }}
      />
      <ProfileStack.Screen name="Bookmarks" component={BookmarksScreen} />
      <ProfileStack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
      />
      <ProfileStack.Screen
        name="BlockedCommunities"
        component={BlockedCommunitiesScreen}
        options={{ title: "Blocked Communities" }}
      />
    </ProfileStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  const theme = useTheme();

  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        headerTitleStyle: {
          color: theme.colors.app.nativeHeaderTitle,
        },
      }}
    >
      <SearchStack.Group>
        <SearchStack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: "Search",
          }}
        />
        <SearchStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
          }}
        />
        <SearchStack.Screen name="Post" component={PostScreen} />
        <SearchStack.Screen name="Community" component={CommunityFeedScreen} />
        <SearchStack.Screen
          name="Subscriptions"
          component={SubscriptionsScreen}
        />
        <SearchStack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
            title: "Your Profile",
          }}
        />
      </SearchStack.Group>

      <SearchStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <SearchStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment" }}
        />
        <SearchStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post" }}
        />
        <SearchStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About" }}
        />
      </SearchStack.Group>
    </SearchStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        headerTitleStyle: {
          color: theme.colors.app.primaryText,
        },
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsIndexScreen}
        options={{
          title: "Settings",
        }}
      />
      <SettingsStack.Screen
        name="ViewAccounts"
        component={ViewAccountsScreen}
        options={{
          title: "Manage Accounts",
        }}
      />
      <SettingsStack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{
          title: "Edit Account",
        }}
      />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  const theme = useTheme();
  const { unread } = useAppSelector(selectSite);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.app.nativeHeader,
        },
        tabBarLabel: "Feed",
      }}
    >
      <Tab.Screen
        name="FeedStack"
        component={FeedStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Ionicons} name="list-outline" size={6} color={color} />
          ),
          tabBarLabel: "Feed",
        }}
      />
      <Tab.Screen
        name="InboxStack"
        component={InboxStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconBell color={color} />,
          tabBarLabel: "Inbox",
          tabBarBadge: unread.replies + unread.mentions + unread.privateMessage,
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSearch color={color} />,
          tabBarLabel: "Search",
        }}
      />
      <Tab.Screen
        name="UserProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Ionicons} name="person-outline" size={6} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Ionicons} name="cog-outline" size={6} color={color} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}

const MainStack = createNativeStackNavigator();

function Stack() {
  const theme = useTheme();

  const accounts = useAppSelector(selectAccounts);
  const accountsLoaded = useAppSelector(selectAccountsLoaded);

  return (
    <NavigationContainer theme={DarkTheme}>
      <MainStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.app.nativeHeader,
          },
        }}
      >
        {(!accountsLoaded && (
          <MainStack.Screen
            name="AppLoading"
            component={LoadingView}
            options={{ title: "Loading..." }}
          />
        )) ||
          (accounts && accounts.length > 0 && (
            <MainStack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
          )) || (
            <>
              <MainStack.Screen
                name="Onboarding"
                component={OnboardingIndexScreen}
                options={{ title: "Welcome" }}
              />
              <MainStack.Screen
                name="AddAccount"
                component={AddAccountScreen}
                options={{ title: "Add Account" }}
              />
              <MainStack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{ title: "Create Account" }}
              />
            </>
          )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default Stack;

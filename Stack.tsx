/* eslint react/no-unstable-nested-components: 0 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "native-base";
import React from "react";
import {
  IconBell,
  IconNotes,
  IconPlanet,
  IconSearch,
  IconUserCircle,
} from "tabler-icons-react-native";
import CommunityAboutScreen from "./components/screens/feeds/CommunityAboutScreen";
import CommunityFeedScreen from "./components/screens/feeds/CommunityFeedScreen";
import FeedsIndexScreen from "./components/screens/feeds/FeedsIndexScreen";
import InboxScreen from "./components/screens/inbox/InboxScreen";
import AddAccountScreen from "./components/screens/onboarding/AddAccountScreen";
import CreateAccountScreen from "./components/screens/onboarding/CreateAccountScreen";
import OnboardingIndexScreen from "./components/screens/onboarding/OnboardingIndexScreen";
import NewCommentScreen from "./components/screens/post/NewCommentScreen";
import NewPostScreen from "./components/screens/post/NewPostScreen";
import PostScreen from "./components/screens/post/PostScreen";
import SearchScreen from "./components/screens/search/SearchScreen";
import EditAccountScreen from "./components/screens/settings/EditAccountScreen";
import SettingsIndexScreen from "./components/screens/settings/SettingsIndexScreen";
import ViewAccountsScreen from "./components/screens/settings/ViewAccountsScreen";
import BlockedCommunitiesScreen from "./components/screens/userProfile/BlockedCommunitiesScreen";
import SubscriptionsScreen from "./components/screens/userProfile/SubscriptionsScreen";
import UserProfileScreen from "./components/screens/userProfile/UserProfileScreen";
import LoadingView from "./components/ui/Loading/LoadingView";
import {
  selectAccounts,
  selectAccountsLoaded,
} from "./slices/accounts/accountsSlice";
import { selectSite } from "./slices/site/siteSlice";
import { useAppSelector } from "./store";
import ThemeSelectionScreen from "./components/screens/settings/Appearance/ThemeSelectionScreen";
import ViewerScreen from "./components/screens/ViewerScreen";
import OnboardingInfoScreenOne from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenOne";
import OnboardingInfoScreenTwo from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenTwo";
import OnboardingInfoScreenThree from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenThree";
import OnboardingInfoScreenFour from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenFour";
import OnboardingInfoScreenFive from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenFive";
import OnboardingInfoScreenSix from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenSix";
import OnboardingInfoScreenSeven from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenSeven";
import HubDiscoveryScreen from "./components/screens/onboarding/hubDiscovery/HubDiscoveryScreen";
import InstanceScreen from "./components/ui/hubDiscovery/InstanceScreen";

const FeedStack = createNativeStackNavigator();

function FeedStackScreen() {
  return (
    <FeedStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
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
        <FeedStack.Screen name="Profile" component={UserProfileScreen} />
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
  return (
    <InboxStack.Navigator
      screenOptions={{
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
        <InboxStack.Screen name="Profile" component={UserProfileScreen} />
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
  return (
    <ProfileStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
      }}
    >
      <ProfileStack.Group>
        <ProfileStack.Screen name="Profile" component={UserProfileScreen} />
        <ProfileStack.Screen
          name="BlockedCommunities"
          component={BlockedCommunitiesScreen}
          options={{ title: "Blocked Communities" }}
        />

        <ProfileStack.Screen
          name="Settings"
          component={SettingsIndexScreen}
          options={{
            title: "Settings",
          }}
        />
        <ProfileStack.Screen
          name="ViewAccounts"
          component={ViewAccountsScreen}
          options={{
            title: "Manage Accounts",
          }}
        />
        <ProfileStack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          options={{
            title: "Edit Account",
          }}
        />
        <ProfileStack.Screen
          name="Viewer"
          component={ViewerScreen}
          options={{
            title: "View",
          }}
        />
        <ProfileStack.Screen
          name="ThemeSelection"
          component={ThemeSelectionScreen}
          options={{
            title: "Theme",
          }}
        />

        <ProfileStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
          }}
        />
        <ProfileStack.Screen name="Post" component={PostScreen} />
        <ProfileStack.Screen name="Community" component={CommunityFeedScreen} />
        <ProfileStack.Screen
          name="Subscriptions"
          component={SubscriptionsScreen}
        />
      </ProfileStack.Group>

      <ProfileStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <ProfileStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment" }}
        />
        <ProfileStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post" }}
        />
        <ProfileStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About" }}
        />
      </ProfileStack.Group>
    </ProfileStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
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
        <SearchStack.Screen name="Profile" component={UserProfileScreen} />
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

const CommunityStack = createNativeStackNavigator();

function CommunityStackScreen() {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen
        name="Settings"
        component={SettingsIndexScreen}
        options={{
          title: "Settings",
        }}
      />
      <CommunityStack.Screen
        name="ViewAccounts"
        component={ViewAccountsScreen}
        options={{
          title: "Manage Accounts",
        }}
      />
      <CommunityStack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{
          title: "Edit Account",
        }}
      />
      <CommunityStack.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
        options={{
          title: "Theme",
        }}
      />
      <CommunityStack.Screen
        name="Viewer"
        component={ViewerScreen}
        options={{
          title: "View",
        }}
      />
    </CommunityStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  const { unread } = useAppSelector(selectSite);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: "Feed",
        freezeOnBlur: true,
      }}
    >
      <Tab.Screen
        name="FeedStack"
        component={FeedStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconNotes color={color} />,
          tabBarLabel: "Feed",
          freezeOnBlur: true,
        }}
      />
      <Tab.Screen
        name="InboxStack"
        component={InboxStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconBell color={color} />,
          tabBarLabel: "Inbox",
          tabBarBadge:
            unread.replies + unread.mentions + unread.privateMessage > 0
              ? unread.replies + unread.mentions + unread.privateMessage
              : null,
          freezeOnBlur: true,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconUserCircle color={color} />,
          tabBarLabel: "Profile",
          freezeOnBlur: true,
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSearch color={color} />,
          tabBarLabel: "Search",
          freezeOnBlur: true,
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconPlanet color={color} />,
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

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.app.accent,
      background: theme.colors.app.bg,
      card: theme.colors.app.navBarBg,
      text: theme.colors.app.textSecondary,
      border: theme.colors.app.border,
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <MainStack.Navigator>
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
                options={{ title: "Welcome", headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoOne"
                component={OnboardingInfoScreenOne}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoTwo"
                component={OnboardingInfoScreenTwo}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoThree"
                component={OnboardingInfoScreenThree}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoFour"
                component={OnboardingInfoScreenFour}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoFive"
                component={OnboardingInfoScreenFive}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoSix"
                component={OnboardingInfoScreenSix}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="OnboardingInfoSeven"
                component={OnboardingInfoScreenSeven}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="HubDiscovery"
                component={HubDiscoveryScreen}
                options={{ title: "Hubs" }}
              />
              <MainStack.Screen
                name="Instance"
                component={InstanceScreen}
                options={{ title: "Instance" }}
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

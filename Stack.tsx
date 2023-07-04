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
import NewCommentScreen from "./components/screens/comments/NewCommentScreen";
import NewPostScreen from "./components/screens/post/NewPostScreen";
import PostScreen from "./components/screens/post/PostScreen";
import SearchScreen from "./components/screens/search/SearchScreen";
import EditAccountScreen from "./components/screens/settings/Account/EditAccountScreen";
import SettingsIndexScreen from "./components/screens/settings/SettingsIndexScreen";
import ViewAccountsScreen from "./components/screens/settings/Account/ViewAccountsScreen";
import BlockedCommunitiesScreen from "./components/screens/userProfile/BlockedCommunitiesScreen";
import UserProfileScreen from "./components/screens/userProfile/UserProfileScreen";
import LoadingView from "./components/ui/Loading/LoadingView";
import {
  selectAccounts,
  selectAccountsLoaded,
} from "./slices/accounts/accountsSlice";
import { selectSite } from "./slices/site/siteSlice";
import { useAppSelector } from "./store";
import ReadSettingsScreen from "./components/screens/settings/Content/ReadSettingsScreen";
import ThemeSelectionScreen from "./components/screens/settings/Appearance/ThemeSelectionScreen";
import ViewerScreen from "./components/screens/ViewerScreen";
import EditCommentScreen from "./components/screens/comments/EditCommentScreen";
import OnboardingInfoScreenOne from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenOne";
import OnboardingInfoScreenTwo from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenTwo";
import OnboardingInfoScreenThree from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenThree";
import OnboardingInfoScreenFour from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenFour";
import OnboardingInfoScreenFive from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenFive";
import OnboardingInfoScreenSix from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenSix";
import OnboardingInfoScreenSeven from "./components/screens/onboarding/infoScreens/OnboardingInfoScreenSeven";
import HubDiscoveryScreen from "./components/screens/onboarding/hubDiscovery/HubDiscoveryScreen";
import InstanceScreen from "./components/ui/hubDiscovery/InstanceScreen";
import NewPostBodyScreen from "./components/screens/post/NewPostBodyScreen";
import TraverseScreen from "./components/screens/traverse/TraverseScreen";
import SearchResultsScreen from "./components/screens/search/SearchResultsScreen";
import AppearanceScreen from "./components/screens/settings/Appearance/AppearanceScreen";
import ContentScreen from "./components/screens/settings/Content/ContentScreen";
import AccountSettingsScreen from "./components/screens/settings/Account/AccountSettingsScreen";

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
            freezeOnBlur: true,
          }}
        />
        <FeedStack.Screen
          name="Post"
          component={PostScreen}
          options={{ freezeOnBlur: true }}
        />
        <FeedStack.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{ freezeOnBlur: true }}
        />
        <FeedStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
      </FeedStack.Group>

      <FeedStack.Group
        screenOptions={{
          presentation: "modal",
          freezeOnBlur: true,
        }}
      >
        <FeedStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment", freezeOnBlur: true }}
        />
        <FeedStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <FeedStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <FeedStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About", freezeOnBlur: true }}
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
            freezeOnBlur: true,
          }}
        />
        <InboxStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
            freezeOnBlur: true,
          }}
        />
        <InboxStack.Screen
          name="Post"
          component={PostScreen}
          options={{ freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{ freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
      </InboxStack.Group>

      <InboxStack.Group
        screenOptions={{
          presentation: "modal",
          freezeOnBlur: true,
        }}
      >
        <InboxStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment", freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment", freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <InboxStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About", freezeOnBlur: true }}
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
        <ProfileStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
        <ProfileStack.Screen
          name="BlockedCommunities"
          component={BlockedCommunitiesScreen}
          options={{ title: "Blocked Communities", freezeOnBlur: true }}
        />

        <ProfileStack.Screen
          name="Settings"
          component={SettingsIndexScreen}
          options={{
            title: "Settings",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="ViewAccounts"
          component={ViewAccountsScreen}
          options={{
            title: "Manage Accounts",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          options={{
            title: "Edit Account",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="ReadSettings"
          component={ReadSettingsScreen}
          options={{
            title: "Mark Post Read On...",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="Viewer"
          component={ViewerScreen}
          options={{
            title: "View",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
          options={{
            title: "Account",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="Content"
          component={ContentScreen}
          options={{
            title: "Content",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{
            title: "Appearance",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="ThemeSelection"
          component={ThemeSelectionScreen}
          options={{
            title: "Theme",
            freezeOnBlur: true,
          }}
        />

        <ProfileStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="Post"
          component={PostScreen}
          options={{ freezeOnBlur: true }}
        />
        <ProfileStack.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{ freezeOnBlur: true }}
        />
      </ProfileStack.Group>

      <ProfileStack.Group
        screenOptions={{
          presentation: "modal",
          freezeOnBlur: true,
        }}
      >
        <ProfileStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment", freezeOnBlur: true }}
        />
        <ProfileStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <ProfileStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <ProfileStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About", freezeOnBlur: true }}
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
            freezeOnBlur: true,
          }}
        />
        <SearchStack.Screen
          name="Results"
          component={SearchResultsScreen}
          options={{
            title: "Search",
            freezeOnBlur: true,
          }}
        />
        <SearchStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
            freezeOnBlur: true,
          }}
        />
        <SearchStack.Screen
          name="Post"
          component={PostScreen}
          options={{ freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{ freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
      </SearchStack.Group>

      <SearchStack.Group
        screenOptions={{
          presentation: "modal",
          freezeOnBlur: true,
        }}
      >
        <SearchStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <SearchStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About", freezeOnBlur: true }}
        />
      </SearchStack.Group>
    </SearchStack.Navigator>
  );
}

const TraverseStack = createNativeStackNavigator();

function TraverseStackScreen() {
  return (
    <TraverseStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
      }}
    >
      <TraverseStack.Group>
        <TraverseStack.Screen
          name="Traverse"
          component={TraverseScreen}
          options={{ title: "Traverse", freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: "Feed",
            freezeOnBlur: true,
          }}
        />
        <TraverseStack.Screen
          name="Post"
          component={PostScreen}
          options={{ freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{ freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
      </TraverseStack.Group>

      <TraverseStack.Group
        screenOptions={{
          presentation: "modal",
          freezeOnBlur: true,
        }}
      >
        <TraverseStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: "New Comment", freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment", freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: "New Post", freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: "About", freezeOnBlur: true }}
        />
      </TraverseStack.Group>
    </TraverseStack.Navigator>
  );
}

// const SettingsStack = createNativeStackNavigator();

// function SettingsStackScreen() {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen
//         name="Settings"
//         component={SettingsIndexScreen}
//         options={{
//           title: "Settings",
//         }}
//       />
//       <SettingsStack.Screen
//         name="ViewAccounts"
//         component={ViewAccountsScreen}
//         options={{
//           title: "Manage Accounts",
//         }}
//       />
//       <SettingsStack.Screen
//         name="EditAccount"
//         component={EditAccountScreen}
//         options={{
//           title: "Edit Account",
//         }}
//       />
//       <SettingsStack.Screen
//         name="ReadSettings"
//         component={ReadSettingsScreen}
//         options={{
//           title: "Mark Post Read On...",
//         }}
//       />
//       <SettingsStack.Screen
//         name="ThemeSelection"
//         component={ThemeSelectionScreen}
//         options={{
//           title: "Theme",
//         }}
//       />
//       <SettingsStack.Screen
//         name="Viewer"
//         component={ViewerScreen}
//         options={{
//           title: "View",
//         }}
//       />
//     </SettingsStack.Navigator>
//   );
// }

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
        name="TraverseStack"
        component={TraverseStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconPlanet color={color} />,
          tabBarLabel: "Traverse",
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
        name="InboxStack"
        component={InboxStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconBell color={color} />,
          tabBarLabel: "Inbox",
          tabBarBadge:
            unread.replies + unread.mentions + unread.privateMessage > 0
              ? // ? unread.replies + unread.mentions + unread.privateMessage
                unread.replies
              : null,
          freezeOnBlur: true,
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
              <MainStack.Screen
                name="Viewer"
                component={ViewerScreen}
                options={{
                  title: "View",
                  freezeOnBlur: true,
                }}
              />
            </>
          )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default Stack;

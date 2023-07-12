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
import { useTranslation } from "react-i18next";
import CommunityAboutScreen from "./src/components/screens/Feed/CommunityAboutScreen";
import CommunityFeedScreen from "./src/components/screens/Feed/CommunityFeedScreen";
import FeedsIndexScreen from "./src/components/screens/Feed/FeedsIndexScreen";
import AddAccountScreen from "./src/components/screens/Onboarding/AddAccountScreen";
import CreateAccountScreen from "./src/components/screens/Onboarding/CreateAccountScreen";
import OnboardingIndexScreen from "./src/components/screens/Onboarding/OnboardingIndexScreen";
import NewCommentScreen from "./src/components/screens/Comments/NewCommentScreen";
import NewPostScreen from "./src/components/screens/Post/NewPostScreen";
import PostScreen from "./src/components/screens/Post/PostScreen";
import SearchScreen from "./src/components/screens/Search/SearchScreen";
import EditAccountScreen from "./src/components/screens/Settings/Account/EditAccountScreen";
import SettingsIndexScreen from "./src/components/screens/Settings/SettingsIndexScreen";
import ViewAccountsScreen from "./src/components/screens/Settings/Account/ViewAccountsScreen";
import BlockedCommunitiesScreen from "./src/components/screens/UserProfile/BlockedCommunitiesScreen";
import UserProfileScreen from "./src/components/screens/UserProfile/UserProfileScreen";
import LoadingView from "./src/components/common/Loading/LoadingView";
import {
  selectAccounts,
  selectAccountsLoaded,
} from "./src/slices/accounts/accountsSlice";
import { selectSite } from "./src/slices/site/siteSlice";
import { useAppSelector } from "./store";
import ThemeSelectionScreen from "./src/components/screens/Settings/Appearance/ThemeSelectionScreen";
import AppearanceScreen from "./src/components/screens/Settings/Appearance/AppearanceScreen";
import ContentScreen from "./src/components/screens/Settings/Content/ContentScreen";
import ViewerScreen from "./src/components/screens/ViewerScreen";
import ReadSettingsScreen from "./src/components/screens/Settings/Content/ReadSettingsScreen";
import UserPostsScreen from "./src/components/screens/UserProfile/UserPostsScreen";
import UserCommentsScreen from "./src/components/screens/UserProfile/UserCommentsScreen";
import NewPostBodyScreen from "./src/components/screens/Post/NewPostBodyScreen";
import EditCommentScreen from "./src/components/screens/Comments/EditCommentScreen";
import OnboardingInfoScreenThree from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenThree";
import OnboardingInfoScreenTwo from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenTwo";
import OnboardingInfoScreenOne from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenOne";
import OnboardingInfoScreenFour from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenFour";
import OnboardingInfoScreenFive from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenFive";
import OnboardingInfoScreenSix from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenSix";
import OnboardingInfoScreenSeven from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenSeven";
import InstanceScreen from "./src/components/screens/HubDiscovery/InstanceScreen";
import HubDiscoveryScreen from "./src/components/screens/Onboarding/HubDiscovery/HubDiscoveryScreen";
import TraverseScreen from "./src/components/screens/Traverse/TraverseScreen";
import SearchResultsScreen from "./src/components/screens/Search/SearchResultsScreen";
import GeneralSettingsScreen from "./src/components/screens/Settings/General/GeneralSettingsScreen";
import AboutScreen from "./src/components/screens/Settings/About/AboutScreen";
import InboxScreen from "./src/components/screens/Inbox/InboxScreen";
import IconSelectionScreen from "./src/components/screens/Settings/Appearance/IconSelectionScreen";

const FeedStack = createNativeStackNavigator();

function FeedStackScreen() {
  const { t } = useTranslation();

  return (
    <FeedStack.Navigator screenOptions={{}}>
      <FeedStack.Group>
        <FeedStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <FeedStack.Screen name="Post" component={PostScreen} />
        <FeedStack.Screen name="Community" component={CommunityFeedScreen} />
        <FeedStack.Screen name="Profile" component={UserProfileScreen} />
        <FeedStack.Screen
          name="UserComments"
          component={UserCommentsScreen}
          options={{
            title: t("Comments"),
          }}
        />
        <FeedStack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            title: t("Posts"),
          }}
        />
        <FeedStack.Screen
          name="UserSavedPosts"
          component={UserPostsScreen}
          options={{
            title: t("Saved Posts"),
          }}
        />
        <FeedStack.Screen
          name="ViewAccounts"
          component={ViewAccountsScreen}
          options={{
            title: t("Manage Accounts"),
          }}
        />
        <FeedStack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          options={{
            title: t("Edit Account"),
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
          options={{ title: t("New Comment") }}
        />
        <SearchStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("Edit Comment") }}
        />
        <FeedStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: t("New Post") }}
        />
        <FeedStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: t("New Post") }}
        />
        <FeedStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
      </FeedStack.Group>
    </FeedStack.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();

function InboxStackScreen() {
  const { t } = useTranslation();

  return (
    <InboxStack.Navigator>
      <InboxStack.Group>
        <InboxStack.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            title: t("Inbox"),
          }}
        />
        <InboxStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <InboxStack.Screen name="Post" component={PostScreen} />
        <InboxStack.Screen name="Community" component={CommunityFeedScreen} />
        <InboxStack.Screen name="Profile" component={UserProfileScreen} />
        <InboxStack.Screen
          name="UserComments"
          component={UserCommentsScreen}
          options={{
            title: "Comments",
          }}
        />
        <InboxStack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            title: t("Posts"),
          }}
        />
        <InboxStack.Screen
          name="UserSavedPosts"
          component={UserPostsScreen}
          options={{
            title: t("Saved Posts"),
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
          options={{ title: t("New Comment") }}
        />
        <InboxStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("Edit Comment") }}
        />
        <InboxStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: t("New Post") }}
        />
        <InboxStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: t("New Post") }}
        />
        <InboxStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
      </InboxStack.Group>
    </InboxStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  const { t } = useTranslation();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
      }}
    >
      <ProfileStack.Group>
        <ProfileStack.Screen name="Profile" component={UserProfileScreen} />
        <ProfileStack.Screen
          name="UserComments"
          component={UserCommentsScreen}
          options={{
            title: t("Comments"),
          }}
        />
        <ProfileStack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            title: t("Posts"),
          }}
        />
        <ProfileStack.Screen
          name="UserSavedPosts"
          component={UserPostsScreen}
          options={{
            title: t("Saved Posts"),
          }}
        />
        <ProfileStack.Screen
          name="BlockedCommunities"
          component={BlockedCommunitiesScreen}
          options={{ title: t("Blocked Communities") }}
        />

        <ProfileStack.Screen
          name="Settings"
          component={SettingsIndexScreen}
          options={{
            title: t("Settings"),
          }}
        />
        <ProfileStack.Screen
          name="ViewAccounts"
          component={ViewAccountsScreen}
          options={{
            title: t("Manage Accounts"),
          }}
        />
        <ProfileStack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          options={{
            title: t("Edit Account"),
          }}
        />
        <ProfileStack.Screen
          name="ReadSettings"
          component={ReadSettingsScreen}
          options={{
            title: t("Mark Post Read On"),
          }}
        />
        <ProfileStack.Screen
          name="Viewer"
          component={ViewerScreen}
          options={{
            title: t("View"),
          }}
        />
        <ProfileStack.Screen
          name="Content"
          component={ContentScreen}
          options={{
            title: t("Content"),
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{
            title: t("Appearance"),
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="ThemeSelection"
          component={ThemeSelectionScreen}
          options={{
            title: t("Theme"),
          }}
        />
        <ProfileStack.Screen
          name="IconSelection"
          component={IconSelectionScreen}
          options={{
            title: t("Icon"),
          }}
        />
        <ProfileStack.Screen
          name="GeneralSettings"
          component={GeneralSettingsScreen}
          options={{
            title: t("General"),
            freezeOnBlur: true,
          }}
        />
        <ProfileStack.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: t("About"),
            freezeOnBlur: true,
          }}
        />

        <ProfileStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <ProfileStack.Screen name="Post" component={PostScreen} />
        <ProfileStack.Screen name="Community" component={CommunityFeedScreen} />
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
          options={{ title: t("New Comment") }}
        />
        <ProfileStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("Edit Comment") }}
        />
        <ProfileStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: t("New Post") }}
        />
        <ProfileStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: t("New Post") }}
        />
        <ProfileStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
      </ProfileStack.Group>
    </ProfileStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  const { t } = useTranslation();

  return (
    <SearchStack.Navigator>
      <SearchStack.Group>
        <SearchStack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: t("Search"),
          }}
        />
        <SearchStack.Screen
          name="Results"
          component={SearchResultsScreen}
          options={{
            title: t("Search"),
          }}
        />
        <SearchStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <SearchStack.Screen name="Post" component={PostScreen} />
        <SearchStack.Screen name="Community" component={CommunityFeedScreen} />
        <SearchStack.Screen name="Profile" component={UserProfileScreen} />
        <SearchStack.Screen
          name="UserComments"
          component={UserCommentsScreen}
          options={{
            title: t("Comments"),
          }}
        />
        <SearchStack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            title: t("Posts"),
          }}
        />
        <SearchStack.Screen
          name="UserSavedPosts"
          component={UserPostsScreen}
          options={{
            title: t("Saved Posts"),
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
          options={{ title: t("New Comment") }}
        />
        <SearchStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("Edit Comment") }}
        />
        <SearchStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: t("New Post") }}
        />
        <SearchStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: t("New Post") }}
        />
        <SearchStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
      </SearchStack.Group>
    </SearchStack.Navigator>
  );
}

const TraverseStack = createNativeStackNavigator();

function TraverseStackScreen() {
  const { t } = useTranslation();

  return (
    <TraverseStack.Navigator>
      <TraverseStack.Group>
        <TraverseStack.Screen
          name="Traverse"
          component={TraverseScreen}
          options={{ title: t("Traverse") }}
        />
        <TraverseStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <TraverseStack.Screen name="Post" component={PostScreen} />
        <TraverseStack.Screen
          name="Community"
          component={CommunityFeedScreen}
        />
        <TraverseStack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ freezeOnBlur: true }}
        />
        <TraverseStack.Screen
          name="UserComments"
          component={UserCommentsScreen}
          options={{
            title: t("Comments"),
          }}
        />
        <TraverseStack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            title: t("Posts"),
          }}
        />
        <TraverseStack.Screen
          name="UserSavedPosts"
          component={UserPostsScreen}
          options={{
            title: t("Saved Posts"),
          }}
        />
      </TraverseStack.Group>

      <TraverseStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <TraverseStack.Screen
          name="NewComment"
          component={NewCommentScreen}
          options={{ title: t("New Comment") }}
        />
        <TraverseStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("Edit Comment") }}
        />
        <TraverseStack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: t("New Post") }}
        />
        <TraverseStack.Screen
          name="NewPostBody"
          component={NewPostBodyScreen}
          options={{ title: t("New Post") }}
        />
        <TraverseStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
      </TraverseStack.Group>
    </TraverseStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  const { unread } = useAppSelector(selectSite);
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: t("Feed"),
        freezeOnBlur: false,
      }}
    >
      <Tab.Screen
        name="FeedStack"
        component={FeedStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconNotes color={color} />,
          tabBarLabel: t("Feed"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="TraverseStack"
        component={TraverseStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconPlanet color={color} />,
          tabBarLabel: t("Traverse"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconUserCircle color={color} />,
          tabBarLabel: t("Profile"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSearch color={color} />,
          tabBarLabel: t("Search"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="InboxStack"
        component={InboxStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IconBell color={color} />,
          tabBarLabel: t("Inbox"),
          tabBarBadge:
            unread.replies + unread.mentions + unread.privateMessage > 0
              ? // ? unread.replies + unread.mentions + unread.privateMessage
                unread.replies
              : null,
          freezeOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
}

const MainStack = createNativeStackNavigator();

function Stack() {
  const { t } = useTranslation();
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
      text: theme.colors.app.textPrimary,
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
            options={{ title: `${t("Loading")}...` }}
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
                options={{ title: t("Welcome"), headerShown: false }}
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
                options={{ title: t("Hubs") }}
              />
              <MainStack.Screen
                name="Instance"
                component={InstanceScreen}
                options={{ title: t("Instance") }}
              />
              <MainStack.Screen
                name="AddAccount"
                component={AddAccountScreen}
                options={{ title: t("Add Account") }}
              />
              <MainStack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{ title: t("Create Account") }}
              />
              <MainStack.Screen
                name="Viewer"
                component={ViewerScreen}
                options={{
                  title: t("View"),
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

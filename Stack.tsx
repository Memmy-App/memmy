/* eslint react/no-unstable-nested-components: 0 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import FastImage from "@gkasdorf/react-native-fast-image";
import { useMe } from "@src/stores/site/siteStore";
import { View } from "./src/components/common/Gluestack";
import {
  useSettingsStore,
  useThemeOptions,
} from "./src/stores/settings/settingsStore";

import { selectSite } from "./src/slices/site/siteSlice";
import { truncateName } from "./src/helpers/TextHelper";
import { ICON_MAP } from "./src/constants/IconMap";
import KeywordsFilterScreen from "./src/components/screens/Settings/Filters/KeywordsFilterScreen";
import InstanceFiltersScreen from "./src/components/screens/Settings/Filters/InstanceFiltersScreen";
import { CustomTabBar } from "./src/components/common/Navigation/CustomTabBar";
import LoadingView from "./src/components/common/Loading/LoadingView";
import SFIcon from "./src/components/common/icons/SFIcon";
import EditCommentScreen from "./src/components/screens/Comments/EditCommentScreen";
import NewCommentScreen from "./src/components/screens/Comments/NewCommentScreen";

import CommunityAboutScreen from "./src/components/screens/Feed/CommunityAboutScreen";
import CommunityFeedScreen from "./src/components/screens/Feed/CommunityFeedScreen";
import FeedsIndexScreen from "./src/components/screens/Feed/FeedsIndexScreen";
import InstanceScreen from "./src/components/screens/HubDiscovery/InstanceScreen";
import InboxScreen from "./src/components/screens/Inbox/InboxScreen";
import AddAccountScreen from "./src/components/screens/Onboarding/AddAccountScreen";
import CreateAccountScreen from "./src/components/screens/Onboarding/CreateAccountScreen";
import HubDiscoveryScreen from "./src/components/screens/Onboarding/HubDiscovery/HubDiscoveryScreen";
import OnboardingInfoScreenFive from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenFive";
import OnboardingInfoScreenFour from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenFour";
import OnboardingInfoScreenOne from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenOne";
import OnboardingInfoScreenSeven from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenSeven";
import OnboardingInfoScreenSix from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenSix";
import OnboardingInfoScreenThree from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenThree";
import OnboardingInfoScreenTwo from "./src/components/screens/Onboarding/InfoScreens/OnboardingInfoScreenTwo";
import OnboardingIndexScreen from "./src/components/screens/Onboarding/OnboardingIndexScreen";
import NewPostBodyScreen from "./src/components/screens/Post/NewPostBodyScreen";
import NewPostScreen from "./src/components/screens/Post/NewPostScreen";
import PostScreen from "./src/components/screens/Post/PostScreen";
import SearchResultsScreen from "./src/components/screens/Search/SearchResultsScreen";
import SearchScreen from "./src/components/screens/Search/SearchScreen";
import AboutScreen from "./src/components/screens/Settings/About/AboutScreen";
import EditAccountScreen from "./src/components/screens/Settings/Account/EditAccountScreen";
import ViewAccountsScreen from "./src/components/screens/Settings/Account/ViewAccountsScreen";
import AppearanceScreen from "./src/components/screens/Settings/Appearance/AppearanceScreen";
import IconSelectionScreen from "./src/components/screens/Settings/Appearance/IconSelectionScreen";
import ThemeSelectionScreen from "./src/components/screens/Settings/Appearance/ThemeSelectionScreen";
import ContentScreen from "./src/components/screens/Settings/Content/ContentScreen";
import ReadSettingsScreen from "./src/components/screens/Settings/Content/ReadSettingsScreen";
import GeneralSettingsScreen from "./src/components/screens/Settings/General/GeneralSettingsScreen";
import SettingsIndexScreen from "./src/components/screens/Settings/SettingsIndexScreen";
import TraverseScreen from "./src/components/screens/Traverse/TraverseScreen";
import BlockedCommunitiesScreen from "./src/components/screens/UserProfile/BlockedCommunitiesScreen";
import UserCommentsScreen from "./src/components/screens/UserProfile/UserCommentsScreen";
import UserPostsScreen from "./src/components/screens/UserProfile/UserPostsScreen";
import UserProfileScreen from "./src/components/screens/UserProfile/UserProfileScreen";
import ViewerScreen from "./src/components/screens/ViewerScreen";
import {
  useAccountStore,
  useAccounts,
  useCurrentAccount,
} from "./src/stores/account/accountStore";
import { useAppSelector } from "./store";
import FiltersScreen from "./src/components/screens/Settings/Filters/FiltersScreen";

function CustomDrawerContent() {
  const theme = useThemeOptions();
  return (
    <>
      {/* Header */}
      <View
        height="$10"
        style={{
          backgroundColor: theme.colors.bg,
        }}
      />
      <TraverseScreen />
    </>
  );
}

const Drawer = createDrawerNavigator();
function FeedDrawerContainerScreen() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        drawerStyle: {
          width: Dimensions.get("window").width / 1.1,
        },
        drawerType: "slide",
      }}
    >
      <Drawer.Screen
        name="FeedScreen"
        component={FeedsIndexScreen}
        options={{
          title: t("Feed"),
        }}
      />
    </Drawer.Navigator>
  );
}

const FeedStack = createNativeStackNavigator();
function FeedStackScreen() {
  const { t } = useTranslation();
  const fullScreenSwipe = !useSettingsStore(
    (state) => state.settings.swipeToVote
  );

  return (
    <FeedStack.Navigator
      screenOptions={{ fullScreenGestureEnabled: fullScreenSwipe }}
    >
      <FeedStack.Group>
        <FeedStack.Screen
          name="FeedDrawerContainer"
          component={FeedDrawerContainerScreen}
          options={{
            headerShown: false,
          }}
        />
        <FeedStack.Screen name="Post" component={PostScreen} />
        <FeedStack.Screen name="Community" component={CommunityFeedScreen} />
        <FeedStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
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
            title: t("Accounts"),
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
          options={{ title: t("comment.edit") }}
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
      </FeedStack.Group>
    </FeedStack.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();
function InboxStackScreen() {
  const { t } = useTranslation();
  const fullScreenSwipe = !useSettingsStore(
    (state) => state.settings.swipeToVote
  );

  return (
    <InboxStack.Navigator
      screenOptions={{ fullScreenGestureEnabled: fullScreenSwipe }}
    >
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
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
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
          options={{ title: t("comment.edit") }}
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
      </InboxStack.Group>
    </InboxStack.Navigator>
  );
}

function SettingsScreens(stack) {
  const { t } = useTranslation();
  return (
    <>
      <stack.Screen
        name="Settings"
        component={SettingsIndexScreen}
        options={{
          title: t("Settings"),
        }}
      />
      <stack.Screen
        name="ViewAccounts"
        component={ViewAccountsScreen}
        options={{
          title: t("Accounts"),
        }}
      />
      <stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{
          title: t("Edit Account"),
        }}
      />
      <stack.Screen
        name="ReadSettings"
        component={ReadSettingsScreen}
        options={{
          title: t("Hide Read Posts"),
        }}
      />
      <stack.Screen
        name="Viewer"
        component={ViewerScreen}
        options={{
          title: t("View"),
        }}
      />
      <stack.Screen
        name="Content"
        component={ContentScreen}
        options={{
          title: t("Content"),
          freezeOnBlur: true,
        }}
      />
      <stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{
          title: t("Appearance"),
          freezeOnBlur: true,
        }}
      />
      <stack.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
        options={{
          title: t("Theme"),
        }}
      />
      <stack.Screen
        name="IconSelection"
        component={IconSelectionScreen}
        options={{
          title: t("Icon"),
        }}
      />
      <stack.Screen
        name="GeneralSettings"
        component={GeneralSettingsScreen}
        options={{
          title: t("General"),
          freezeOnBlur: true,
        }}
      />
      <stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{
          title: t("Filters"),
        }}
      />
      <stack.Screen
        name="KeywordFilters"
        component={KeywordsFilterScreen}
        options={{
          title: t("Keywords"),
        }}
      />
      <stack.Screen
        name="InstanceFilters"
        component={InstanceFiltersScreen}
        options={{
          title: t("Instances"),
        }}
      />
      <stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: t("About"),
          freezeOnBlur: true,
        }}
      />
    </>
  );
}

const SettingsStack = createNativeStackNavigator();
function SettingsStackScreen() {
  const fullScreenSwipe = !useSettingsStore(
    (state) => state.settings.swipeToVote
  );

  return (
    <SettingsStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
        fullScreenGestureEnabled: fullScreenSwipe,
      }}
    >
      {SettingsScreens(SettingsStack)}
    </SettingsStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  const { t } = useTranslation();
  const fullScreenSwipe = !useSettingsStore(
    (state) => state.settings.swipeToVote
  );

  return (
    <ProfileStack.Navigator
      screenOptions={{
        freezeOnBlur: true,
        fullScreenGestureEnabled: fullScreenSwipe,
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

        {SettingsScreens(ProfileStack)}

        <ProfileStack.Screen
          name="FeedScreen"
          component={FeedsIndexScreen}
          options={{
            title: t("Feed"),
          }}
        />
        <ProfileStack.Screen name="Post" component={PostScreen} />
        <ProfileStack.Screen name="Community" component={CommunityFeedScreen} />
        <ProfileStack.Screen
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
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
          options={{ title: t("New Comment") }}
        />
        <ProfileStack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: t("comment.edit") }}
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
      </ProfileStack.Group>
    </ProfileStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();
function SearchStackScreen() {
  const { t } = useTranslation();
  const fullScreenSwipe = !useSettingsStore(
    (state) => state.settings.swipeToVote
  );

  return (
    <SearchStack.Navigator
      screenOptions={{ fullScreenGestureEnabled: fullScreenSwipe }}
    >
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
          name="CommunityAbout"
          component={CommunityAboutScreen}
          options={{ title: t("About") }}
        />
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
          options={{ title: t("comment.edit") }}
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
      </SearchStack.Group>
    </SearchStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function Tabs() {
  const { unread } = useAppSelector(selectSite);
  const { t } = useTranslation();
  const currentAccount = useCurrentAccount();
  const me = useMe();

  const hideUsernameInTab = useSettingsStore(
    (state) => state.settings.hideUsernameInTab
  );
  const hideAvatarInTab = useSettingsStore(
    (state) => state.settings.hideAvatarInTab
  );

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
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
          tabBarIcon: ({ color }) => (
            <SFIcon icon={ICON_MAP.FEED} color={color} />
          ),
          tabBarLabel: t("Feed"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="InboxStack"
        component={InboxStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SFIcon icon={ICON_MAP.INBOX} color={color} />
          ),
          tabBarLabel: t("Inbox"),

          tabBarBadge:
            unread.replies + unread.mentions + unread.privateMessage > 0
              ? // ? unread.replies + unread.mentions + unread.privateMessage
                unread.replies
              : null,
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) =>
            !hideAvatarInTab && me?.local_user_view.person.avatar ? (
              <FastImage
                source={{
                  uri: me?.local_user_view.person.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <SFIcon icon={ICON_MAP.USER_AVATAR} color={color} />
            ),
          tabBarLabel: hideUsernameInTab
            ? "Profile"
            : truncateName(currentAccount?.username ?? "Profile", 8),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SFIcon icon={ICON_MAP.SEARCH} color={color} />
          ),
          tabBarLabel: t("Search"),
          freezeOnBlur: false,
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackScreen}
        options={{
          headerShown: false,
          // tabBarIcon: ({ color }) => <IconSettings color={color} />,
          tabBarIcon: ({ color }) => (
            <SFIcon icon={ICON_MAP.SETTINGS} color={color} />
          ),
          tabBarLabel: t("Settings"),
          freezeOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
}

const MainStack = createNativeStackNavigator();
interface StackProps {
  onReady: () => void;
}

function Stack({ onReady }: StackProps) {
  const theme = useThemeOptions();
  const { t } = useTranslation();
  const accounts = useAccounts();
  const accountStore = useAccountStore();

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.accent,
      background: theme.colors.bg,
      card: theme.colors.navBarBg,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer onReady={onReady} theme={MyTheme}>
      <MainStack.Navigator>
        {(accountStore.status.loading && (
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

const styles = StyleSheet.create({
  avatar: {
    height: 24,
    width: 24,
    borderRadius: 24,
  },
});

export default Stack;

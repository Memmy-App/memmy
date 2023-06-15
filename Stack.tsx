import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import FeedsIndexScreen from "./screens/feeds/FeedsIndexScreen";
import CommunityFeedScreen from "./screens/feeds/CommunityFeedScreen";
import PostScreen from "./screens/post/PostScreen";
import NewPostScreen from "./screens/post/NewPostScreen";
import SettingsIndexScreen from "./screens/settings/SettingsIndexScreen";
import EditAccountScreen from "./screens/settings/EditAccountScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Icon, useTheme} from "native-base";
import NewCommentScreen from "./screens/post/NewCommentScreen";
import {Ionicons} from "@expo/vector-icons";
import OnboardingIndexScreen from "./screens/onboarding/OnboardingIndexScreen";
import {getServers} from "./helpers/SettingsHelper";
import OnboardingScreen from "./screens/onboarding/OnboardingIndexScreen";
import AddAccountScreen from "./screens/onboarding/AddAccountScreen";
import CreateAccountScreen from "./screens/onboarding/CreateAccountScreen";

const Stack = () => {
    const theme = useTheme();

    const FeedStack = createNativeStackNavigator();

    const FeedStackScreen = () => {
        return (
            <FeedStack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.screen[900],
                    },
                    headerTitleStyle: {
                        color: theme.colors.lightText,
                    }
                }}
            >
                <FeedStack.Group>
                    <FeedStack.Screen
                        name={"FeedScreen"}
                        component={FeedsIndexScreen}
                        options={{
                            title: "Feed"
                        }}
                    />
                    <FeedStack.Screen name={"Community"} component={CommunityFeedScreen} />
                    <FeedStack.Screen name={"Post"} component={PostScreen} />
                    <FeedStack.Screen name={"NewPost"} component={NewPostScreen} />
                </FeedStack.Group>

                <FeedStack.Group
                    screenOptions={{
                        presentation: "modal"
                    }}
                >
                    <FeedStack.Screen name={"NewComment"} component={NewCommentScreen} options={{title: "New Comment"}} />
                </FeedStack.Group>
            </FeedStack.Navigator>
        );
    };

    const SettingsStack = createNativeStackNavigator();

    const SettingsStackScreen = () => {
        return (
            <SettingsStack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.screen[900],
                    },
                    headerTitleStyle: {
                        color: theme.colors.lightText,
                    }
                }}
            >
                <SettingsStack.Screen
                    name={"SettingsScreen"}
                    component={SettingsIndexScreen}
                />
                <SettingsStack.Screen
                    name={"EditAccount"}
                    component={EditAccountScreen}
                />
            </SettingsStack.Navigator>
        );
    };

    const Tab = createBottomTabNavigator();

    const Tabs = () => {
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: theme.colors.screen[900],
                    },
                    tabBarLabel: "Feed"
                }}
            >
                <Tab.Screen name={"FeedStack"} component={FeedStackScreen} options={{
                    headerShown: false,
                    tabBarIcon: ({color}) => <Icon as={Ionicons} name={"list-outline"} size={6} color={color} />
                }} />
                <Tab.Screen name={"SettingsStack"} component={SettingsStackScreen} options={{
                    headerShown: false,
                    tabBarIcon: ({color}) => <Icon as={Ionicons} name={"cog-outline"} size={6} color={color} />,
                    tabBarLabel: "Settings"
                }} />
            </Tab.Navigator>
        );
    };

    const MainStack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <MainStack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.screen[900]
                }
            }}>
                <MainStack.Screen name={"Tabs"} component={Tabs} options={{headerShown: false}}/>
                <MainStack.Screen name={"Onboarding"} component={OnboardingIndexScreen} options={{title: "Welcome"}} />
                <MainStack.Screen name={"AddAccount"} component={AddAccountScreen} options={{title: "Add Account"}} />
                <MainStack.Screen name={"CreateAccount"} component={CreateAccountScreen} options={{title: "Create Account"}} />
            </MainStack.Navigator>
        </NavigationContainer>
    );
};

export default Stack;
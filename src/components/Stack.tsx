import React from "react";
import { useTranslation } from "react-i18next";
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from "@react-navigation/core";
import FeedIndexScreen from "@src/screens/Feed/FeedIndexScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { NativeStackNavigatorProps } from "react-native-screens/lib/typescript/native-stack/types";

const FeedStack = createNativeStackNavigator();

function MainScreens(
  stack: TypedNavigator<
    ParamListBase,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    ({
      id,
      initialRoutename,
      children,
      screenListeners,
      screenOptions,
      ...rest
    }: NativeStackNavigatorProps) => JSX.Element
  >,
): React.JSX.Element {
  return (
    <>
      <stack.Screen
        name="FeedIndex"
        component={FeedIndexScreen}
        options={{
          headerShown: true,
        }}
      />
    </>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={FeedStackScreen} />
    </Tab.Navigator>
  );
}

function FeedStackScreen() {
  const { t } = useTranslation();

  return <FeedStack.Navigator>{MainScreens(FeedStack)}</FeedStack.Navigator>;
}

const MainStack = createNativeStackNavigator();

export default function Stack(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen name="Tabs" component={Tabs} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

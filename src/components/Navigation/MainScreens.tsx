import React from 'react';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from '@react-navigation/core';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';
import FeedIndexScreen from '@components/Feed/screens/FeedIndexScreen';
import PostScreen from '@components/Post/screens/PostScreen';
import MainFeed from '@components/Feed/components/MainFeed';
import CommentChainScreen from '@components/Comment/screens/CommentChainScreen';
import ReplyScreen from '@components/Reply/screens/ReplyScreen';
import ProfileScreen from '@components/Profile/screens/ProfileScreen';
import NewPostScreen from '@components/NewPost/screens/NewPostScreen';
import WebViewScreen from '@components/WebViewer/WebViewScreen';
import EditReplyScreen from '@components/Reply/screens/EditReplyScreen';

export default function MainScreens(
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
      <stack.Group
        screenOptions={{
          headerShown: true,
        }}
      >
        <stack.Screen name="Feed" component={FeedIndexScreen} />
        <stack.Screen name="Post" component={PostScreen} />
        <stack.Screen
          name="CommentChain"
          component={CommentChainScreen}
          options={{
            headerTitle: 'More Comments',
          }}
        />
        <stack.Screen name="Community" component={MainFeed} />
        <stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </stack.Group>
      <stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: true,
        }}
      >
        <stack.Screen
          name="Reply"
          component={ReplyScreen}
          options={{ gestureEnabled: false }}
        />
        <stack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ gestureEnabled: false, headerTitle: 'New Post' }}
        />
        <stack.Screen
          name="EditReply"
          component={EditReplyScreen}
          options={{ gestureEnabled: false, headerTitle: 'Edit Comment' }}
        />
        <stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{ headerTitle: 'View' }}
        />
      </stack.Group>
    </>
  );
}

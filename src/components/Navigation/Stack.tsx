import React, { useMemo } from 'react';
import {
  DarkTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from '@components/Navigation/Tabs';
import { useAccounts } from '@src/state/account/accountStore';
import OnboardingIndexScreen from '@components/Onboarding/OnboardingIndex/OnboardingIndexScreen';
import OnboardingInstanceListScreen from '@components/Onboarding/OnboardingInstanceList/OnboardingInstanceListScreen';
import CreateAccountModal from '@components/Account/CreateAccountModal';
import AddAccountModal from '@components/Account/AddAccountModal';
import { useTheme } from 'tamagui';

const Stack = createNativeStackNavigator();

export default function MainStack(): React.JSX.Element {
  const accounts = useAccounts();
  const theme = useTheme();

  const navTheme: Theme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: theme.accent.val,
        background: theme.bg.val,
        card: theme.navBarBg.val,
        text: theme.color.val,
        border: theme.border.val,
      },
    }),
    [theme],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        {accounts.length < 1 ? (
          <>
            <Stack.Group>
              <Stack.Screen
                name="Onboarding"
                component={OnboardingIndexScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OnboardingInstanceList"
                component={OnboardingInstanceListScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Select an Instance',
                }}
              />
            </Stack.Group>
            <Stack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: true,
              }}
            >
              <Stack.Screen
                name="CreateAccount"
                component={CreateAccountModal}
                options={{
                  headerTitle: 'Create an Account',
                }}
              />
              <Stack.Screen
                name="AddAccount"
                component={AddAccountModal}
                options={{
                  headerTitle: 'Add an Account',
                }}
              />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from '@components/Navigation/Tabs';
import { useAccounts } from '@src/state/account/accountStore';
import OnboardingIndexScreen from '@components/Onboarding/OnboardingIndex/OnboardingIndexScreen';
import OnboardingInstanceListScreen from '@components/Onboarding/OnboardingInstanceList/OnboardingInstanceListScreen';

const Stack = createNativeStackNavigator();

export default function MainStack(): React.JSX.Element {
  const accounts = useAccounts();
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          accounts.length < 1
            ? (
              <>
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
              </>
              )
            : (
              <Stack.Screen name="Tabs" component={Tabs} options={{
                headerShown: false,
              }} />
              )
        }

      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import SettingsIndexScreen from '@components/Settings/screens/SettingsIndexScreen';
import SettingsGeneralScreen from '@components/Settings/screens/SettingsGeneralScreen';
import SettingsContentScreen from '@components/Settings/screens/SettingsContentScreen';
import SettingsReadScreen from '@components/Settings/screens/SettingsReadScreen';
import SettingsAccountScreen from '@components/Settings/screens/SettingsAccountsScreen';
import SettingsAboutScreen from '@components/Settings/screens/SettingsAboutScreen';
import { useScreenOptions } from '@hooks/useScreenOptions';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const screenOptions = useScreenOptions();

  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name="Index"
        component={SettingsIndexScreen}
        options={{ headerTitle: 'Settings' }}
      />
      <SettingsStack.Screen
        name="General"
        component={SettingsGeneralScreen}
        options={{ headerTitle: 'General' }}
      />
      <SettingsStack.Screen
        name="Content"
        component={SettingsContentScreen}
        options={{ headerTitle: 'Content' }}
      />
      <SettingsStack.Screen
        name="Read"
        component={SettingsReadScreen}
        options={{ headerTitle: 'Read Options' }}
      />
      <SettingsStack.Screen
        name="Accounts"
        component={SettingsAccountScreen}
        options={{ headerTitle: 'Accounts' }}
      />
      <SettingsStack.Screen name="About" component={SettingsAboutScreen} />
    </SettingsStack.Navigator>
  );
}

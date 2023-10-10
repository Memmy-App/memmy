import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import SettingsIndexScreen from '@components/Settings/screens/SettingsIndexScreen';
import SettingsGeneralScreen from '@components/Settings/screens/SettingsGeneralScreen';
import SettingsContentScreen from '@components/Settings/screens/SettingsContentScreen';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <SettingsStack.Navigator>
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
    </SettingsStack.Navigator>
  );
}

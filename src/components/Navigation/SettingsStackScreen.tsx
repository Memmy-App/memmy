import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import SettingsIndexScreen from '@components/Settings/screens/SettingsIndexScreen';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Index" component={SettingsIndexScreen} options={{ headerTitle: 'Settings' }} />
    </SettingsStack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsIndexScreen from '@components/Settings/screens/SettingsIndexScreen';
import SettingsGeneralScreen from '@components/Settings/screens/SettingsGeneralScreen';
import SettingsContentScreen from '@components/Settings/screens/SettingsContentScreen';
import SettingsReadScreen from '@components/Settings/screens/SettingsReadScreen';
import SettingsAccountScreen from '@components/Settings/screens/SettingsAccountsScreen';
import SettingsAboutScreen from '@components/Settings/screens/SettingsAboutScreen';
import SettingsGesturesScreen from '@components/Settings/screens/SettingsGesturesScreen';
import SettingsIconScreen from '@components/Settings/screens/SettingsIconScreen';
import SettingsAppearanceScreen from '@components/Settings/screens/SettingsAppearanceScreen';
import SettingsThemeScreen from '@components/Settings/screens/SettingsThemesScreen';
import SettingsAccentScreen from '@components/Settings/screens/SettingsAccentScreen';
import AddAccountModal from '@components/Account/screens/AddAccountModal';
import WebViewScreen from '@components/WebViewer/WebViewScreen';
import SettingsFiltersScreen from '@components/Settings/screens/SettingsFiltersScreen';
import SettingsFilterScreen from '@components/Settings/screens/SettingsFilterScreen';
import SettingsBlockedPersonsScreen from '@components/Settings/screens/SettingsBlockedPersonsScreen';
import SettingsBlockedCommunitiesScreen from '@components/Settings/screens/SettingsBlockedCommunitiesScreen';
import { useFullWidthSwipes } from '@src/state';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen(): React.JSX.Element {
  const fullWidthSwipes = useFullWidthSwipes();

  return (
    <SettingsStack.Navigator
      screenOptions={{ fullScreenGestureEnabled: fullWidthSwipes }}
    >
      <SettingsStack.Group>
        <SettingsStack.Screen
          name="Index"
          component={SettingsIndexScreen}
          options={{ headerTitle: 'Settings', headerLargeTitle: true }}
        />
        <SettingsStack.Screen
          name="General"
          component={SettingsGeneralScreen}
        />
        <SettingsStack.Screen
          name="Content"
          component={SettingsContentScreen}
        />
        <SettingsStack.Screen
          name="Read"
          component={SettingsReadScreen}
          options={{ headerTitle: 'Read Options' }}
        />
        <SettingsStack.Screen
          name="Accounts"
          component={SettingsAccountScreen}
        />
        <SettingsStack.Screen
          name="Gestures"
          component={SettingsGesturesScreen}
        />
        <SettingsStack.Screen name="About" component={SettingsAboutScreen} />
        <SettingsStack.Screen name="Icon" component={SettingsIconScreen} />
        <SettingsStack.Screen
          name="Appearance"
          component={SettingsAppearanceScreen}
        />
        <SettingsStack.Screen name="Themes" component={SettingsThemeScreen} />
        <SettingsStack.Screen name="Accent" component={SettingsAccentScreen} />
        <SettingsStack.Screen
          name="Filters"
          component={SettingsFiltersScreen}
        />
        <SettingsStack.Screen name="Filter" component={SettingsFilterScreen} />
        <SettingsStack.Screen
          name="BlockedUsers"
          component={SettingsBlockedPersonsScreen}
          options={{
            headerTitle: 'Blocked Users',
          }}
        />
        <SettingsStack.Screen
          name="BlockedCommunities"
          component={SettingsBlockedCommunitiesScreen}
          options={{
            headerTitle: 'Blocked Communities',
          }}
        />
      </SettingsStack.Group>

      <SettingsStack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <SettingsStack.Screen
          name="AddAccount"
          component={AddAccountModal}
          options={{
            headerTitle: 'Add Account',
          }}
        />
        <SettingsStack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{ headerTitle: 'View' }}
        />
      </SettingsStack.Group>
    </SettingsStack.Navigator>
  );
}

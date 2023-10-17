// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO Do proper typing

import React, { useEffect, useMemo } from 'react';
import { ScrollView, Spacer, View } from 'tamagui';
import Table from '@components/Common/Table/Table';
import {
  DarkThemeOptions,
  INavigationProps,
  LightThemeOptions,
} from '@src/types';
import { customTokens } from '@src/theme';
import { setSetting } from '@src/state/settings/actions';
import { Check } from '@tamagui/lucide-icons';
import { useSettingsStore } from '@src/state/settings/settingsStore';

interface IThemeColors {
  accent: string;
  bg: string;
}

function ThemeColors({ accent, bg }: IThemeColors): React.JSX.Element {
  return (
    <View borderRadius={8} overflow="hidden" marginRight="$2">
      <View width={25} height={25} backgroundColor={bg}>
        <View
          width={0}
          height={0}
          borderTopColor={accent}
          borderTopWidth={25}
          borderRightWidth={25}
          borderRightColor="transparent"
        />
      </View>
    </View>
  );
}

export default function SettingsThemeScreen({
  navigation,
  route,
}: INavigationProps): React.JSX.Element {
  const { themeType } = route.params;
  const settings = useSettingsStore();

  useEffect(() => {
    navigation.setOptions({
      headerTitle:
        themeType === 'light'
          ? 'Light Theme'
          : themeType === 'dark'
          ? 'Dark Theme'
          : 'Theme',
    });
  }, []);

  const onThemePress = (selection: string): void => {
    switch (themeType) {
      case 'all':
        setSetting('theme', selection);
        break;
      case 'light':
        setSetting('themeLight', selection);
        break;
      case 'dark':
        setSetting('themeDark', selection);
        break;
      default:
        break;
    }
  };

  const currentTheme = useMemo(() => {
    switch (themeType) {
      case 'all':
        return settings.theme;
      case 'light':
        return settings.themeLight;
      case 'dark':
        return settings.themeDark;
      default:
        return 'lightTheme';
    }
  }, [settings]);

  return (
    <ScrollView flex={1}>
      <Spacer />
      <Table.Container>
        {(themeType === 'all' || themeType === 'light') && (
          <Table.Section header="Light Themes">
            {Object.keys(LightThemeOptions).map((key, index) => (
              <Table.Cell
                key={index}
                label={LightThemeOptions[key]}
                accessoryLeft={
                  <ThemeColors
                    bg={customTokens[`${key}Colors`].bg}
                    accent={customTokens[`${key}Colors`].accent}
                  />
                }
                accessoryRight={currentTheme === key ? <Check /> : undefined}
                onPress={() => {
                  onThemePress(key);
                }}
              />
            ))}
          </Table.Section>
        )}
        {(themeType === 'all' || themeType === 'dark') && (
          <Table.Section header="Dark Themes">
            {Object.keys(DarkThemeOptions).map((key, index) => (
              <Table.Cell
                key={index}
                label={DarkThemeOptions[key]}
                accessoryLeft={
                  <ThemeColors
                    bg={customTokens[`${key}Colors`].bg}
                    accent={customTokens[`${key}Colors`].accent}
                  />
                }
                accessoryRight={currentTheme === key ? <Check /> : undefined}
                onPress={() => {
                  onThemePress(key);
                }}
              />
            ))}
          </Table.Section>
        )}
      </Table.Container>
    </ScrollView>
  );
}

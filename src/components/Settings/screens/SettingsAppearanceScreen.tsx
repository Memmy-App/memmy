import React from 'react';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { setSetting, useSettingsStore } from '@src/state';
import { AllThemeOptions, INavigationProps } from '@src/types';

export default function SettingsAppearanceScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Themes">
          <Table.Cell
            label="Accent Color"
            useChevron
            onPress={() => {
              navigation.push('Accent');
            }}
          />
          <Table.Cell
            label="Follow System Theme"
            switchValue={settings.themeMatchSystem}
            onSwitchValueChange={(v) => {
              setSetting('themeMatchSystem', v);
            }}
          />
          {!settings.themeMatchSystem ? (
            <Table.Cell
              label="Selected Theme"
              rightLabel={AllThemeOptions[settings.theme]}
              useChevron
              onPress={() => {
                navigation.push('Themes', {
                  themeType: 'all',
                });
              }}
              isLast
            />
          ) : (
            <>
              <Table.Cell
                label="Selected Light Theme"
                rightLabel={AllThemeOptions[settings.themeLight]}
                useChevron
                onPress={() => {
                  navigation.push('Themes', {
                    themeType: 'light',
                  });
                }}
              />
              <Table.Cell
                label="Selected Dark Theme"
                rightLabel={AllThemeOptions[settings.themeDark]}
                useChevron
                onPress={() => {
                  navigation.push('Themes', {
                    themeType: 'dark',
                  });
                }}
                isLast
              />
            </>
          )}
        </Table.Section>
        <Table.Section header="Post Appearance">
          <Table.Cell
            label="Images Ignore Screen Height"
            switchValue={settings.imagesIgnoreScreenHeight}
            onSwitchValueChange={(v) => {
              setSetting('imagesIgnoreScreenHeight', v);
            }}
          />
          <Table.Cell
            label="Display Total Score"
            switchValue={settings.totalScore}
            onSwitchValueChange={(v) => {
              setSetting('totalScore', v);
            }}
          />
          <Table.Cell
            label="Display Community Icons"
            switchValue={settings.showCommunityIconInFeed}
            onSwitchValueChange={(v) => {
              setSetting('showCommunityIconInFeed', v);
            }}
          />
          <Table.Cell
            label="Display User Avatars"
            switchValue={settings.showAvatarInFeed}
            onSwitchValueChange={(v) => {
              setSetting('showAvatarInFeed', v);
            }}
          />
        </Table.Section>
        <Table.Section header="Tab Bar Appearance">
          <Table.Cell
            label="Display Avatar in Tab Bar"
            switchValue={settings.showAvatarInTabBar}
            onSwitchValueChange={(v) => {
              setSetting('showAvatarInTabBar', v);
            }}
          />
          <Table.Cell
            label="Display Username in Tab Bar"
            switchValue={settings.showAvatarInTabBar}
            onSwitchValueChange={(v) => {
              setSetting('showUsernameInTabBar', v);
            }}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

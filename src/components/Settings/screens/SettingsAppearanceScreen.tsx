import React from 'react';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { setSetting } from '@src/state/settings/actions';
import { INavigationProps } from '@src/types';

export default function SettingsAppearanceScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Themes">
          <Table.Cell
            label="Themes"
            useChevron
            onPress={() => {
              navigation.push('Themes');
            }}
          />
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

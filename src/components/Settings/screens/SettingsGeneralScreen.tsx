import React from 'react';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { Switch } from 'react-native';
import { setSetting } from '@src/state/settings/actions/setSetting';
import { useSettingsStore } from '@src/state/settings/settingsStore';

export default function SettingsGeneralScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Browser">
          <Table.Cell
            label="Use Default Browser"
            accessoryRight={
              <Switch
                onChange={(e) => {
                  setSetting('useDefaultBrowser', e.nativeEvent.value);
                }}
                value={settings.useDefaultBrowser}
              />
            }
          />
          <Table.Cell
            label="Use Reader Mode"
            accessoryRight={
              <Switch
                onChange={(e) => {
                  setSetting('readerMode', e.nativeEvent.value);
                }}
                value={settings.readerMode}
              />
            }
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

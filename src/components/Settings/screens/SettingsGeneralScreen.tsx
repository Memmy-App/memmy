import React from 'react';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';
import { Switch } from 'react-native';
import { setSetting } from '@src/state/settings/actions/setSetting';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { capitalizeFirstLetter } from '@helpers/text';
import { createContextMenuOptionsFromStrings } from '@helpers/contextMenu';
import { hapticStrengthOptions } from '@src/types/options';

export default function SettingsGeneralScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const contextHapticStrengthOptions = createContextMenuOptionsFromStrings(
    hapticStrengthOptions,
  );

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Haptics">
          <Table.Cell
            label="Enable Haptics"
            accessoryRight={
              <Switch
                onChange={(e) => {
                  setSetting('hapticsEnabled', e.nativeEvent.value);
                }}
                value={settings.hapticsEnabled}
              />
            }
          />
          <AppContextMenuButton
            options={contextHapticStrengthOptions}
            onPressMenuItem={(e) => {
              setSetting('hapticsStrength', e.nativeEvent.actionKey);
            }}
          >
            <Table.Cell
              label="Haptic Strength"
              rightLabel={capitalizeFirstLetter(settings.hapticsStrength)}
              useChevron
            />
          </AppContextMenuButton>
        </Table.Section>
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

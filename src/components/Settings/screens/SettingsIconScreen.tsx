import React from 'react';
import { ScrollView } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { appIconOptions } from '@src/types/AppIconType';
import { Image } from 'expo-image';
import { setSetting } from '@src/state/settings/actions';
import { changeIcon } from 'react-native-change-icon';

export default function SettingsIconScreen(): React.JSX.Element {
  return (
    <ScrollView>
      <Table.Container>
        <Table.Section header="App Icon" footer="App icons by dizzy@lemmy.ml">
          {Object.entries(appIconOptions).map(([key, value]) => (
            <Table.Cell
              key={key}
              label={value.display}
              accessoryLeft={
                <Image
                  source={value.path}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                />
              }
              useChevron
              onPress={() => {
                setSetting('appIcon', key);
                void changeIcon(key);
              }}
            />
          ))}
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

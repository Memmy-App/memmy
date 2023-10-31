import React from 'react';
import { useBlockedPersons } from '@src/state';
import { ScrollView, Text, YStack } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { getBaseUrl } from '@helpers/links';
import { Alert, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { User } from '@tamagui/lucide-icons';
import instance from '@src/Instance';
import { useThemeColorScheme } from '@src/hooks';

export default function SettingsBlockedPersonsScreen(): React.JSX.Element {
  const colorScheme = useThemeColorScheme();

  const blockedPersons = useBlockedPersons();

  if (blockedPersons?.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Text fontSize="$4" fontStyle="italic" color="$secondary">
          You have not blocked anyone yet.
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Blocked Users">
          {blockedPersons?.map((view, index) => (
            <Table.Cell
              label={`${view.target.name}@${getBaseUrl(view.target.actor_id)}`}
              accessoryLeft={
                view.target.avatar != null ? (
                  <Image source={view.target.avatar} style={styles.avatar} />
                ) : (
                  <User color="$accent" size={30} style={styles.avatar} />
                )
              }
              useChevron
              onPress={() => {
                Alert.alert(
                  'Unblock User',
                  `Are you sure you want to unblock ${view.target.name}?`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Unblock',
                      onPress: () => {
                        void instance.blockPerson({
                          personId: view.target.id,
                          block: false,
                        });
                      },
                    },
                  ],
                  {
                    userInterfaceStyle: colorScheme,
                  },
                );
              }}
              key={index}
            />
          ))}
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 10,
  },
});

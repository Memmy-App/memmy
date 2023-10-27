import React from 'react';
import { useBlockedCommunities } from '@src/state';
import { ScrollView, Text, YStack } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { getBaseUrl } from '@helpers/links';
import { Alert, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Globe } from '@tamagui/lucide-icons';
import instance from '@src/Instance';
import { useThemeColorScheme } from '@src/hooks';

export default function SettingsBlockedCommunitiesScreen(): React.JSX.Element {
  const colorScheme = useThemeColorScheme();
  const blockedCommunities = useBlockedCommunities();

  if (blockedCommunities?.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Text fontSize="$4" fontStyle="italic" color="$secondary">
          You have not blocked any communities yet.
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Blocked Communities">
          {blockedCommunities?.map((view, index) => (
            <Table.Cell
              label={`${view.community.name}@${getBaseUrl(
                view.community.actor_id,
              )}`}
              accessoryLeft={
                view.community.icon != null ? (
                  <Image source={view.community.icon} style={styles.avatar} />
                ) : (
                  <Globe color="$accent" size={30} style={styles.avatar} />
                )
              }
              useChevron
              onPress={() => {
                Alert.alert(
                  'Unblock Community',
                  `Are you sure you want to unblock ${view.community.name}?`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Unblock',
                      onPress: () => {
                        void instance.blockCommunity(view.community.id, false);
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

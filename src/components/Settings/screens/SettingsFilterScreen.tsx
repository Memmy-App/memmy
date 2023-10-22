import React, { useCallback, useEffect } from 'react';
import { INavigationProps } from '@src/types';
import { ScrollView, Text, useTheme, YStack } from 'tamagui';
import Table from '@components/Common/Table/Table';
import { useInstanceFilters, useKeywordFilters } from '@src/state';
import {
  addInstanceFilter,
  addKeywordFilter,
  removeInstanceFilter,
  removeKeywordFilter,
} from '@src/state/filters/actions';
import { Alert, Button } from 'react-native';
import { useThemeColorScheme } from '@src/hooks';
import HeaderButton from '@components/Common/Button/HeaderButton';

export default function SettingsFilterScreen({
  navigation,
  route,
}: INavigationProps): React.JSX.Element {
  const { type } = route.params;

  const theme = useTheme();
  const colorScheme = useThemeColorScheme();

  const items =
    type === 'instance' ? useInstanceFilters() : useKeywordFilters();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: type === 'instance' ? 'Instance Filters' : 'Keyword Filters',
      headerRight: () => <HeaderButton title="Add" onPress={onAddItemPress} />,
    });
  }, []);

  const onAddItemPress = useCallback(() => {
    Alert.prompt(
      type === 'instance' ? 'Add Instance Filter' : 'Add Keyword Filter',
      `Enter ${type === 'instance' ? 'an instance' : 'a keyword'} to filter.`,
      (v) => {
        if (type === 'instance') {
          addInstanceFilter(v);
        } else {
          addKeywordFilter(v);
        }
      },
      undefined,
      '',
      undefined,
      {
        userInterfaceStyle: colorScheme,
        cancelable: true,
      },
    );
  }, []);

  if (items.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Text fontSize="$4" fontStyle="italic" color="$secondary">
          No filters yet. Would you like to add one?
        </Text>
        <Button
          title="Add Filter"
          color={theme.accent.val}
          onPress={onAddItemPress}
        />
      </YStack>
    );
  }

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Filters">
          {items.map((item, index) => (
            <Table.Cell
              label={item}
              key={index}
              useChevron
              onPress={() => {
                Alert.alert(
                  'Remove Filter',
                  'Do you want to delete this filter?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        if (type === 'instance') {
                          removeInstanceFilter(item);
                        } else {
                          removeKeywordFilter(item);
                        }
                      },
                    },
                  ],
                );
              }}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

import React from 'react';
import Table from '@components/Common/Table/Table';
import ScrollView from '@components/Common/Gui/ScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CellIcon from '@components/Common/Table/CellIcon';
import {
  AtSign,
  Cog,
  EyeOff,
  Hand,
  MessageCircle,
  Paintbrush,
  User,
} from '@tamagui/lucide-icons';
import { deleteLog, sendLog } from '@src/helpers';
import { Alert } from 'react-native';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

const onEmailDebugLogPress = async (): Promise<void> => {
  try {
    await sendLog();
  } catch (e: any) {
    Alert.alert('Error', 'No debug log was found.');
  }
};

const onClearDebugLogPress = (): void => {
  try {
    deleteLog();
    Alert.alert('Success', 'Debug log has been cleared.');
  } catch (e) {
    Alert.alert(
      'Error',
      'Error clearing debug log. There might not be a debug log to clear.',
    );
  }
};

export default function SettingsIndexScreen({
  navigation,
}: IProps): React.JSX.Element {
  return (
    <ScrollView flex={1} contentInsetAdjustmentBehavior="automatic">
      <Table.Container>
        <Table.Section>
          <Table.Cell
            label="General"
            useChevron
            onPress={() => {
              navigation.push('General');
            }}
            accessoryLeft={<CellIcon bgColor="#FF8E00" icon={<Cog />} />}
          />
          <Table.Cell
            label="Content"
            useChevron
            onPress={() => {
              navigation.push('Content');
            }}
            accessoryLeft={
              <CellIcon bgColor="#F43A9F" icon={<MessageCircle />} />
            }
          />
          <Table.Cell
            label="Appearance"
            useChevron
            onPress={() => {
              navigation.push('Appearance');
            }}
            accessoryLeft={<CellIcon bgColor="#BB4BE5" icon={<Paintbrush />} />}
          />
          <Table.Cell
            label="Gestures"
            useChevron
            onPress={() => {
              navigation.push('Gestures');
            }}
            accessoryLeft={<CellIcon bgColor="#BB4BE5" icon={<Hand />} />}
          />
          <Table.Cell
            label="Accounts"
            useChevron
            onPress={() => {
              navigation.push('Accounts');
            }}
            accessoryLeft={<CellIcon bgColor="#00CA48" icon={<User />} />}
          />
          <Table.Cell
            label="Filters"
            useChevron
            accessoryLeft={<CellIcon bgColor="#ed5a6e" icon={<EyeOff />} />}
          />
          <Table.Cell
            label="About"
            useChevron
            onPress={() => {
              navigation.push('About');
            }}
            accessoryLeft={<CellIcon bgColor="#0368D4" icon={<AtSign />} />}
          />
        </Table.Section>
        <Table.Section header="Memmy">
          <Table.Cell label="Privacy" useChevron />
          <Table.Cell label="Terms" useChevron />
          <Table.Cell label="Report a Bug" useChevron />
          <Table.Cell label="Check Lemmy Service" useChevron />
          <Table.Cell
            label="Submit Debug Log"
            useChevron
            onPress={onEmailDebugLogPress}
          />
          <Table.Cell
            label="Clear Debug Log"
            useChevron
            onPress={onClearDebugLogPress}
          />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

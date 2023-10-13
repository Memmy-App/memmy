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

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsIndexScreen({
  navigation,
}: IProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section>
          <Table.Cell
            label="General"
            useChevron
            onPress={() => {
              navigation.navigate('General');
            }}
            accessoryLeft={<CellIcon bgColor="#FF8E00" icon={<Cog />} />}
          />
          <Table.Cell
            label="Content"
            useChevron
            onPress={() => {
              navigation.navigate('Content');
            }}
            accessoryLeft={
              <CellIcon bgColor="#F43A9F" icon={<MessageCircle />} />
            }
          />
          <Table.Cell
            label="Appearance"
            useChevron
            accessoryLeft={<CellIcon bgColor="#BB4BE5" icon={<Paintbrush />} />}
          />
          <Table.Cell
            label="Gestures"
            useChevron
            onPress={() => {
              navigation.navigate('Gestures');
            }}
            accessoryLeft={<CellIcon bgColor="#BB4BE5" icon={<Hand />} />}
          />
          <Table.Cell
            label="Accounts"
            useChevron
            onPress={() => {
              navigation.navigate('Accounts');
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
              navigation.navigate('About');
            }}
            accessoryLeft={<CellIcon bgColor="#0368D4" icon={<AtSign />} />}
          />
        </Table.Section>
        <Table.Section header="Memmy">
          <Table.Cell label="Privacy" useChevron />
          <Table.Cell label="Terms" useChevron />
          <Table.Cell label="Report a Bug" useChevron />
          <Table.Cell label="Check Lemmy Service" useChevron />
        </Table.Section>
      </Table.Container>
    </ScrollView>
  );
}

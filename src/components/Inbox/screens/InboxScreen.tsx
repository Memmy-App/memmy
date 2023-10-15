import React from 'react';
import { ScrollView, Text } from 'tamagui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function InboxScreen({ navigation }: IProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Text>Test</Text>
    </ScrollView>
  );
}

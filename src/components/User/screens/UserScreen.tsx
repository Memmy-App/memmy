import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text } from 'tamagui';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function UserScreen({ navigation }: IProps): React.JSX.Element {
  return (
    <ScrollView flex={1}>
      <Text>Test</Text>
    </ScrollView>
  );
}

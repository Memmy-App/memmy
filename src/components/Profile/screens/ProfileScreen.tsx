import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text } from 'tamagui';
import { useProfileScreen } from '@components/Profile/hooks/useProfileScreen';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function ProfileScreen({
  navigation,
}: IProps): React.JSX.Element {
  const profileScreen = useProfileScreen();

  return (
    <ScrollView flex={1}>
      <Text>Test</Text>
    </ScrollView>
  );
}

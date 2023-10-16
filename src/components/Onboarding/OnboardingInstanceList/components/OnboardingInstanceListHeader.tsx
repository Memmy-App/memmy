import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import P1 from '@components/Common/Text/P1';
import VStack from '@components/Common/Stack/VStack';
import { Button } from '@components/Common/Button';
import { DoorOpen, UserPlus } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function OnboardingInstanceListHeader(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onAddAccountPress = (): void => {
    navigation.push('AddAccount');
  };

  const onCreateAccountPress = (): void => {
    navigation.push('CreateAccount');
  };

  return (
    <VStack alignItems="center" padding="$2" marginHorizontal="$2" space="$2">
      <P1>Already have an instance?</P1>
      <HStack space="$2">
        <Button width="50%" onPress={onCreateAccountPress}>
          <UserPlus size={24} color="$accentHighlight" />
          Join
        </Button>
        <Button width="50%" onPress={onAddAccountPress}>
          <DoorOpen size={24} color="$accentHighlight" />
          Login
        </Button>
      </HStack>
    </VStack>
  );
}

import React from 'react';
import P1 from '@components/Common/Text/P1';
import { XStack, YStack } from 'tamagui';
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
    <YStack alignItems="center" p="$2" mx="$2" space="$2">
      <P1>Already have an instance?</P1>
      <XStack space="$2">
        <Button width="50%" onPress={onCreateAccountPress}>
          <UserPlus size={24} color="$accentHighlight" />
          Join
        </Button>
        <Button width="50%" onPress={onAddAccountPress}>
          <DoorOpen size={24} color="$accentHighlight" />
          Login
        </Button>
      </XStack>
    </YStack>
  );
}

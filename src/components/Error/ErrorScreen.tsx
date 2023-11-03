import React from 'react';
import { Spacer, Text, YStack } from 'tamagui';
import { Frown } from '@tamagui/lucide-icons';
import { Button } from 'react-native';
import { sendLog } from '@src/helpers';

export default function ErrorScreen(): React.JSX.Element {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      px="$5"
      backgroundColor="$bg"
      space="$3"
    >
      <Frown size={120} />
      <Text textAlign="center" fontSize="$3">
        An error has occurred. We are not sure what it was, but it was probably
        pretty serious.
      </Text>
      <Text textAlign="center" fontSize="$3">
        It would be a huge help if you could send us information about this
        crash. It is up to you, and we do not send anything without your
        permission.
      </Text>
      <Text textAlign="center" fontSize="$3">
        If you want to, press the button below. We will try to make it right!
      </Text>
      <Spacer />
      <Button
        title="Email Debug Log"
        onPress={() => {
          void sendLog();
        }}
      />
    </YStack>
  );
}

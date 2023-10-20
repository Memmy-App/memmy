import React from 'react';
import { Text, YStack } from 'tamagui';
import { UseSignup } from '@components/Account/hooks/useSignup';
import { Button } from '@components/Common/Button';
import { Linking } from 'react-native';

interface IProps {
  signup: UseSignup;
  doSignup: () => void;
}

const openEmail = (): void => {
  void Linking.openURL('message://');
};

export default function VerifyEmailNotice({
  signup,
  doSignup,
}: IProps): React.JSX.Element {
  return (
    <YStack paddingHorizontal="$2" space="$2">
      <Text fontSize="$7" fontWeight="$6" textAlign="center">
        Check Your Inbox
      </Text>
      <Text fontSize="$4" textAlign="center">
        An email has been sent to you to verify your email address. Once you
        have done so, press Get Started.
      </Text>
      <Button onPress={openEmail} disabled={signup.loading}>
        Open Mail
      </Button>
      <Button onPress={doSignup} disabled={signup.loading}>
        <Text>Get Started</Text>
      </Button>
    </YStack>
  );
}

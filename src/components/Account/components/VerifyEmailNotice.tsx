import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';
import { UseSignup } from '@components/Account/hooks/useSignup';
import { Button } from '@components/Common/Button';
import { Linking } from 'react-native';

interface IProps {
  signup: UseSignup;
  doSignup: () => void;
}

export default function VerifyEmailNotice({
  signup,
  doSignup,
}: IProps): React.JSX.Element {
  return (
    <VStack paddingHorizontal="$2" space="$2">
      <Text fontSize="$7" fontWeight="$6" textAlign="center">
        Check Your Inbox
      </Text>
      <Text fontSize="$4" textAlign="center">
        An email has been sent to you to verify your email address. Once you
        have done so, press Get Started.
      </Text>
      <Button
        onPress={async () => await Linking.openURL('message://')}
        disabled={signup.loading}
      >
        Open Mail
      </Button>
      <Button onPress={doSignup} disabled={signup.loading}>
        <Text>Get Started</Text>
      </Button>
    </VStack>
  );
}

import React from 'react';
import { Theme, YStack } from 'tamagui';
import { ImageBackground } from 'expo-image';
import { OnboardingH1 } from '@components/Onboarding/components/OnboardingH1';
import { Button } from '@components/Common/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const background = require('@root/assets/splash.jpg');

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function OnboardingIndexScreen({
  navigation,
}: IProps): React.JSX.Element {
  return (
    <ImageBackground
      source={background}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <Theme name="darkTheme">
        <YStack flex={1} justifyContent="center" mx={20} space="$9">
          <OnboardingH1>Hello!👋</OnboardingH1>
          <OnboardingH1>Welcome to the Fediverse</OnboardingH1>

          <Button
            onPress={() => {
              navigation.push('OnboardingInstanceList');
            }}
          >
            Get Started
          </Button>
        </YStack>
      </Theme>
    </ImageBackground>
  );
}

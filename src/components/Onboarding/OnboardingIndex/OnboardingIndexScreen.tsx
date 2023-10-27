import React, { useEffect } from 'react';
import { Text, Theme, YStack } from 'tamagui';
import { ImageBackground } from 'expo-image';
import { Button } from '@components/Common/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const background = require('@root/assets/splash.jpg');

export default function OnboardingIndexScreen(): React.JSX.Element {
  useEffect(() => {}, []);

  return (
    <ImageBackground
      source={background}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
    >
      <Theme name="darkTheme">
        <PartOne />
      </Theme>
    </ImageBackground>
  );
}

function PartOne(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut}
    >
      <YStack flex={1} justifyContent="center" mx={20} space="$6">
        <Text fontSize={42} fontWeight="bold">
          Hello! 👋
        </Text>
        <Text fontSize={36} fontWeight="bold">
          Let&apos;s get you started. Do you already have a Lemmy instance?
          account
        </Text>

        <YStack space="$3">
          <Button
            color="white"
            backgroundColor="#000"
            onPress={() => {
              navigation.push('AddAccount');
            }}
            fontSize={20}
          >
            Yes, I&apos;m Ready to Sign In
          </Button>
          <Button
            color="white"
            backgroundColor="#000"
            onPress={() => {
              navigation.navigate('OnboardingInstanceList');
            }}
            fontSize={20}
          >
            No, I Need One
          </Button>
        </YStack>
      </YStack>
    </Animated.View>
  );
}

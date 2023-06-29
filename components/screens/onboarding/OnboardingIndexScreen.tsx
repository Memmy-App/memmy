import React from "react";
import { StyleSheet } from "react-native";
import { Button, HStack, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function OnboardingScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();

  return (
    <VStack
      flex={1}
      backgroundColor={theme.colors.app.bg}
      justifyContent="space-between"
      alignItems="center"
      space="md"
      px={5}
    >
      <VStack space={2} justifyContent="center" alignItems="center">
        <FastImage
          source={require("../../../assets/splash.png")}
          style={styles.image}
        />
        <Text fontSize={24} fontWeight="bold">
          Welcome to Lemmy!
        </Text>
        <Text fontSize={18} textAlign="center" opacity={0.6}>
          New to Lemmy? We&apos;ll help you find an instance and create an
          account.
        </Text>
      </VStack>
      <VStack mb={10} space="md" w="full">
        <Button
          size="lg"
          colorScheme="blue"
          onPress={() => navigation.push("CreateAccount")}
        >
          Get Started
        </Button>
        <Button
          size="lg"
          colorScheme="blue"
          variant="ghost"
          onPress={() => navigation.push("AddAccount")}
        >
          I Already Have an Account
        </Button>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    aspectRatio: 1,
  },
});

export default OnboardingScreen;

import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Button, Text, View, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const background = require("../../../assets/onboard-bg.png");

function OnboardingScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px={6} pt={32} pb={20} space={12} flex={1}>
          <Text
            fontSize="6xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            Hello 👋
          </Text>
          <View>
            <Text
              fontSize="5xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              Welcome to
            </Text>
            <Text
              fontSize="5xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              Memmy
            </Text>
          </View>
          <VStack marginTop="auto" space="4">
            <Button
              size="lg"
              colorScheme="lightBlue"
              onPress={() => navigation.push("OnboardingInfoOne")}
              mt="auto"
              borderRadius="20"
              py={2.5}
            >
              <Text fontWeight="semibold" fontSize="lg">
                Get Started
              </Text>
            </Button>
            <Button
              size="lg"
              colorScheme="blueGray"
              onPress={() => navigation.push("HubDiscovery")}
              mt="auto"
              borderRadius="20"
              py={2.5}
            >
              <Text fontWeight="semibold" fontSize="lg">
                I Have an Account
              </Text>
            </Button>
          </VStack>
        </VStack>
      </ImageBackground>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  image: {
    width: 200,
    aspectRatio: 1,
  },
});

export default OnboardingScreen;

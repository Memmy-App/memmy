import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, VStack } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";

const background = require("../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenSeven({ navigation }: IProps) {
  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px={6} pt={12} pb={20} space={4} flex={1}>
          <Text
            fontSize="3xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            Let&apos; get started!
          </Text>
          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            We’ll first set you up with a hub. We’ll give you a list of options
            to pick from.
          </Text>

          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            There are many options available with many different communities.
          </Text>

          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            You can later go back to instance selection to choose another hub.
          </Text>

          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() => navigation.push("HubDiscovery")}
            borderRadius="20"
            mt="auto"
          >
            <Text fontWeight="semibold" fontSize="lg">
              Continue
            </Text>
          </Button>
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

export default OnboardingInfoScreenSeven;

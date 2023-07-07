import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, VStack } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";

const background = require("../../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenThree({ navigation }: IProps) {
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
            Let’s think of the Fediverse like a postal service ✉️
          </Text>
          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            When you use apps like Instagram, Twitter or Facebook, they
            <Text color="lightBlue.500">
              {" "}
              exclusively handle the mail for you.
            </Text>
          </Text>

          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            Everyone receives and sends mail through them. They are
            <Text color="lightBlue.500"> centralized.</Text>
          </Text>

          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() => navigation.push("OnboardingInfoFour")}
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

export default OnboardingInfoScreenThree;

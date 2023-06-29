import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, View, VStack } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";

const background = require("../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenFive({ navigation }: IProps) {
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
            Who is my <Text color="lightBlue.500">hub?</Text> 🤔
          </Text>
          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            A<Text color="lightBlue.500"> hub</Text> can be started by anyone,
            like a community group. You choose which one you want to
            <Text color="lightBlue.500"> join</Text>.
          </Text>

          <Text
            fontSize="2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            We will help you select a hub and start posting in it. 🤗
          </Text>

          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() => navigation.push("OnboardingInfoSix")}
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

export default OnboardingInfoScreenFive;

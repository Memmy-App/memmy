import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, View, VStack } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";

const background = require("../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenOne({ navigation }: IProps) {
  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px={6} pt={32} pb={20} space={4} flex={1}>
          <Text
            fontSize="6xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            First,
          </Text>
          <View>
            <Text
              fontSize="3xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              Do you already know about the Fediverse?
            </Text>
          </View>
          <HStack marginTop="auto" space="4">
            <Button
              size="lg"
              colorScheme="blueGray"
              onPress={() => navigation.push("CreateAccount")}
              mt="auto"
              borderRadius="20"
              py={2.5}
              width="50%"
            >
              <Text fontWeight="semibold" fontSize="lg">
                Yes
              </Text>
            </Button>
            <Button
              size="lg"
              colorScheme="lightBlue"
              onPress={() => navigation.push("OnboardingInfoTwo")}
              mt="auto"
              borderRadius="20"
              py={2.5}
              flexGrow={1}
            >
              <Text fontWeight="semibold" fontSize="lg">
                No
              </Text>
            </Button>
          </HStack>
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

export default OnboardingInfoScreenOne;

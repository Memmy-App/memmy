import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "native-base";
import { Button, HStack, Text, VStack } from "@components/common/Gluestack";
import { ImageBackground, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const background = require("../../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenOne({ navigation }: IProps) {
  const { t } = useTranslation();

  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px="$6" pt="$12" pb="$20" space="lg" flex={1}>
          <Text
            fontSize="$6xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            First,
          </Text>
          <View>
            <Text
              fontSize="$3xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              {t("onboarding.info.1.1")}
            </Text>
          </View>
          <HStack marginTop="auto" space="lg">
            <Button
              size="lg"
              colorScheme="blueGray"
              onPress={() => navigation.push("HubDiscovery")}
              mt="auto"
              borderRadius="$20"
              py="$2.5"
              width="50%"
            >
              <Text fontWeight="semibold" fontSize="$lg">
                {t("Yes")}
              </Text>
            </Button>
            <Button
              size="lg"
              colorScheme="lightBlue"
              onPress={() => navigation.push("OnboardingInfoTwo")}
              mt="auto"
              borderRadius="$20"
              py="$2.5"
              flexGrow={1}
            >
              <Text fontWeight="semibold" fontSize="$lg">
                {t("No")}
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

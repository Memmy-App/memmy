import React, { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { View } from "native-base";
import { Button, Text, VStack } from "@components/common/Gluestack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { resetInstance } from "../../../LemmyInstance";

const background = require("../../../../assets/onboard-bg.png");

function OnboardingScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    resetInstance();
  }, []);

  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px={6} pt={32} pb={20} space="12} flex={1">
          <Text
            fontSize="$6xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            {t("onboarding.hello")} 👋
          </Text>
          <View>
            <Text
              fontSize="$5xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              {t("onboarding.welcomeTo")}
            </Text>
            <Text
              fontSize="$5xl"
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
              borderRadius="$20"
              py={2.5}
            >
              <Text fontWeight="semibold" fontSize="$lg">
                {t("onboarding.getStartedBtn")}
              </Text>
            </Button>
            <Button
              size="lg"
              colorScheme="blueGray"
              onPress={() => navigation.push("HubDiscovery")}
              mt="auto"
              borderRadius="$20"
              py={2.5}
            >
              <Text fontWeight="semibold" fontSize="$lg">
                {t("onboarding.hasAccountBtn")}
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

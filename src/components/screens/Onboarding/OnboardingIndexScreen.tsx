import React, { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Button, Text, View, VStack } from "@components/common/Gluestack";
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
        <VStack px="$6" pt="$32" pb="$20" space="8xl" flex={1}>
          <Text size="6xl" color="white" fontWeight="semibold" textAlign="left">
            {t("onboarding.hello")} 👋
          </Text>
          <View>
            <Text
              size="5xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              {t("onboarding.welcomeTo")}
            </Text>
            <Text
              size="5xl"
              color="white"
              fontWeight="semibold"
              textAlign="left"
            >
              Memmy
            </Text>
          </View>
          <VStack marginTop="auto" space="lg">
            <Button
              size="lg"
              variant="solid"
              action="primary"
              onPress={() => navigation.push("OnboardingInfoOne")}
              mt="auto"
              borderRadius="$20"
              py="$2.5"
            >
              <Text fontWeight="semibold" size="lg">
                {t("onboarding.getStartedBtn")}
              </Text>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="secondary"
              onPress={() => navigation.push("HubDiscovery")}
              mt="auto"
              borderRadius="$20"
              py="$2.5"
            >
              <Text fontWeight="semibold" size="lg">
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

import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, VStack } from "@src/components/common/Gluestack";
import { ImageBackground, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const background = require("../../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenSeven({ navigation }: IProps) {
  const { t } = useTranslation();

  return (
    <VStack flex={1}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <VStack px="$6" pt="$12" pb="$20" space="lg" flex={1}>
          <Text size="3xl" color="white" fontWeight="semibold" textAlign="left">
            {t("onboarding.info.7.1")}
          </Text>
          <Text size="2xl" color="white" fontWeight="semibold" textAlign="left">
            {t("onboarding.info.7.2")}
          </Text>

          <Text size="2xl" color="white" fontWeight="semibold" textAlign="left">
            {t("onboarding.info.7.3")}
          </Text>

          <Text size="2xl" color="white" fontWeight="semibold" textAlign="left">
            {t("onboarding.info.7.4")}
          </Text>

          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => navigation.push("HubDiscovery")}
            borderRadius="$3xl"
            mt="auto"
          >
            <Text fontWeight="semibold" size="lg">
              {t("Continue")}
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

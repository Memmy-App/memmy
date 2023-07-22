import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, VStack } from "@components/common/Gluestack";
import { ImageBackground, StyleSheet } from "react-native";
import { Trans, useTranslation } from "react-i18next";

const background = require("../../../../../assets/onboard-bg2.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function OnboardingInfoScreenFive({ navigation }: IProps) {
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
            fontSize="$3xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            <Trans
              i18nKey="onboarding.info.5.1"
              components={{ emphasis: <Text color="lightBlue.500" /> }}
            />
          </Text>
          <Text
            fontSize="$2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            <Trans
              i18nKey="onboarding.info.5.2"
              components={{ emphasis: <Text color="lightBlue.500" /> }}
            />
          </Text>

          <Text
            fontSize="$2xl"
            color="white"
            fontWeight="semibold"
            textAlign="left"
          >
            <Trans
              i18nKey="onboarding.info.5.3"
              components={{ emphasis: <Text color="lightBlue.500" /> }}
            />
          </Text>

          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() => navigation.push("OnboardingInfoSix")}
            borderRadius="$20"
            mt="auto"
          >
            <Text fontWeight="semibold" fontSize="$lg">
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

export default OnboardingInfoScreenFive;

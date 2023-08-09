import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import LoadingModal from "@src/components/common/Loading/LoadingModal";
import { Button, Image, Text, VStack } from "@src/components/gluestack";
import { Input } from "react-native-elements";
import { Trans, useTranslation } from "react-i18next";
import { Linking, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useCreateAccount from "@src/hooks/onboarding/useCreateAccount";

const header = require("../../../../assets/header.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function CreateAccountScreen({ navigation }: IProps): React.JSX.Element {
  const theme = useThemeOptions();
  const { t } = useTranslation();

  const createAccount = useCreateAccount();

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.bg }}
      keyboardShouldPersistTaps="handled"
    >
      <LoadingModal loading={createAccount.status.loading} />

      <VStack flex={1} mb="$5" space="md" justifyContent="center">
        {createAccount.sentEmail ? (
          <VStack px="$4" space="md">
            <Text size="4xl" textAlign="center">
              {t("onboarding.checkEmail")}
            </Text>
            <Text size="lg" textAlign="center">
              {t("onboarding.emailSent", [createAccount.form.email])}
            </Text>
            <Button
              variant="outline"
              onPress={() => Linking.openURL("message://")}
              disabled={createAccount.status.loading}
            >
              <Text>{t("onboarding.openEmailAppBtn")}</Text>
            </Button>
            <Button
              onPress={createAccount.onLoginPress}
              disabled={createAccount.status.loading}
            >
              <Text>{t("onboarding.getStartedBtn")}</Text>
            </Button>
          </VStack>
        ) : (
          <VStack mx="$3">
            <Image
              source={header}
              style={{
                height: 175,
                width: "100%",
                borderBottomWidth: 1,
                borderColor: "white",
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
            <Input
              value={createAccount.form.host}
              label={t("Server")}
              onChange={(e) =>
                createAccount.onChange("host", e.nativeEvent.text)
              }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="web-search"
              style={{
                color: theme.colors.textPrimary,
              }}
            />
            <Input
              label={t("Username")}
              onChange={(e) =>
                createAccount.onChange("username", e.nativeEvent.text)
              }
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                color: theme.colors.textPrimary,
              }}
            />
            <Input
              label={t("Email")}
              onChange={(e) =>
                createAccount.onChange("email", e.nativeEvent.text)
              }
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                color: theme.colors.textPrimary,
              }}
              keyboardType="email-address"
            />
            <Input
              label={t("Password")}
              onChange={(e) =>
                createAccount.onChange("password", e.nativeEvent.text)
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={{
                color: theme.colors.textPrimary,
              }}
            />
            <Input
              label={t("Password Again")}
              onChange={(e) =>
                createAccount.onChange("passwordAgain", e.nativeEvent.text)
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={{
                color: theme.colors.textPrimary,
              }}
            />

            {createAccount.showCaptcha && (
              <>
                <Image
                  source={{ uri: `data:image/png;base64,${createAccount.png}` }}
                  style={{ height: 100 }}
                  resizeMode="contain"
                />
                <Input
                  label={t("Captcha Answer")}
                  onChange={(e) =>
                    createAccount.onChange("captchaAnswer", e.nativeEvent.text)
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    color: theme.colors.textPrimary,
                  }}
                />
              </>
            )}
            <Text justifyContent="center" alignItems="center">
              <Trans
                i18nKey="onboarding.agreeToTermsOfUse"
                components={{
                  linkAction: (
                    <Pressable
                      onPress={() =>
                        navigation.push("Viewer", { type: "terms" })
                      }
                    />
                  ),
                  linkText: <Text mt="$1.5" color={theme.colors.accent} />,
                }}
              />
            </Text>
            <Button
              size="sm"
              variant="solid"
              action="primary"
              onPress={createAccount.onSignupPress}
              borderRadius="$3xl"
              mt="$3"
              mx="$2"
            >
              <Text fontWeight="semibold" size="lg">
                {t("Signup")}
              </Text>
            </Button>
          </VStack>
        )}
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default CreateAccountScreen;

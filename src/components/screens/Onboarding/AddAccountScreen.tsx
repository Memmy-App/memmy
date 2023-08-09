import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import LoadingModal from "@src/components/common/Loading/LoadingModal";
import useAddAccount from "@src/hooks/onboarding/useAddAccount";
import { Button, Image, Text, VStack } from "@src/components/gluestack";
import { Input } from "react-native-elements";
import { Trans, useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const header = require("../../../../assets/header.jpg");

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function AddAccountScreen({ navigation }: IProps): React.JSX.Element {
  const theme = useThemeOptions();
  const { t } = useTranslation();

  const addAccount = useAddAccount();

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.bg }}
      keyboardShouldPersistTaps="handled"
    >
      <LoadingModal loading={addAccount.status.loading} />

      <VStack flex={1} mb="$5" space="md" justifyContent="center">
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
            value={addAccount.form.host}
            label={t("Server")}
            onChange={(e) => addAccount.onChange("host", e.nativeEvent.text)}
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
              addAccount.onChange("username", e.nativeEvent.text)
            }
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              color: theme.colors.textPrimary,
            }}
          />
          <Input
            label={t("Password")}
            onChange={(e) =>
              addAccount.onChange("password", e.nativeEvent.text)
            }
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={{
              color: theme.colors.textPrimary,
            }}
          />
          <Input
            placeholder={t("(Optional)")}
            label={t("2FA Token")}
            onChange={(e) =>
              addAccount.onChange("totpToken", e.nativeEvent.text)
            }
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              color: theme.colors.textPrimary,
            }}
          />
          <Text justifyContent="center" alignItems="center">
            <Trans
              i18nKey="onboarding.agreeToTermsOfUse"
              components={{
                linkAction: (
                  <Pressable
                    onPress={() => navigation.push("Viewer", { type: "terms" })}
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
            onPress={addAccount.onLoginPress}
            borderRadius="$3xl"
            mt="$3"
            mx="$2"
          >
            <Text fontWeight="semibold" size="lg">
              {t("Login")}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default AddAccountScreen;

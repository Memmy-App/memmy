import React from "react";
import { useTheme } from "native-base";
import { Center, Pressable, Text } from "@components/common/Gluestack";
import { useTranslation } from "react-i18next";

interface LoadingErrorFooterProps {
  onRetryPress: () => void | Promise<void>;
  message: string;
}

function LoadingErrorFooter({
  onRetryPress,
  message,
}: LoadingErrorFooterProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Center flex={1} my="$4">
      <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
        {`${message || t("loadingError.text")}`}
      </Text>
      <Pressable
        onPress={onRetryPress}
        borderColor="blue.500"
        borderWidth={1}
        borderRadius={5}
        padding={1}
        mt="$2"
      >
        <Text color="blue.500">{t("loadingError.retryBtn")}</Text>
      </Pressable>
    </Center>
  );
}

export default LoadingErrorFooter;

import React from "react";
import { Center, Pressable, Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
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
  const theme = useAppSelector(selectThemeOptions);

  return (
    <Center flex={1} my="$4">
      <Text fontStyle="italic" color={theme.colors.textSecondary}>
        {`${message || t("loadingError.text")}`}
      </Text>
      <Pressable
        onPress={onRetryPress}
        borderColor="blue500"
        borderWidth={1}
        borderRadius="$md"
        padding={1}
        mt="$2"
      >
        <Text color="blue500">{t("loadingError.retryBtn")}</Text>
      </Pressable>
    </Center>
  );
}

export default LoadingErrorFooter;

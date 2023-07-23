import React from "react";
import { Text, View } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

interface LoadingViewProps {
  onRetryPress: () => void | Promise<void>;
}

function LoadingErrorView({ onRetryPress }: LoadingViewProps) {
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);

  return (
    <View style={styles.container} backgroundColor={theme.colors.bg}>
      <Text fontStyle="italic" color="gray500">
        {t("loadingError.text")}
      </Text>
      <Button title={t("loadingError.retryBtn")} onPress={onRetryPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingErrorView;

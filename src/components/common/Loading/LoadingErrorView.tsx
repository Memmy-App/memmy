import React from "react";
import { useTheme } from "native-base";
import { Text, View } from "@components/common/Gluestack";
import { Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

interface LoadingViewProps {
  onRetryPress: () => void | Promise<void>;
}

function LoadingErrorView({ onRetryPress }: LoadingViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container} backgroundColor={theme.colors.app.bg}>
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

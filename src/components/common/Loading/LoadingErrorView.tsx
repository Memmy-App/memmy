import React from "react";
import { Text, View } from "@src/components/gluestack";
import { Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface LoadingViewProps {
  onRetryPress: () => void | Promise<void>;
}

function LoadingErrorView({
  onRetryPress,
}: LoadingViewProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useThemeOptions();

  return (
    <View style={styles.container} backgroundColor={theme.colors.bg}>
      <Text fontStyle="italic" color="$gray500">
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

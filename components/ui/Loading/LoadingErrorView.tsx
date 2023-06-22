import React from "react";
import { Text, useTheme, View } from "native-base";
import { Button, StyleSheet } from "react-native";

interface LoadingViewProps {
  onRetryPress: () => void | Promise<void>;
}

function LoadingErrorView({ onRetryPress }: LoadingViewProps) {
  const theme = useTheme();

  return (
    <View
      style={styles.container}
      backgroundColor={theme.colors.app.backgroundSecondary}
    >
      <Text fontStyle="italic" color="gray.500">
        Error loading content :(
      </Text>
      <Button title="Retry" onPress={onRetryPress} />
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

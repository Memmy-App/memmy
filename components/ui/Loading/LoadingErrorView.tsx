import React from "react";
import { Text, View } from "native-base";
import { Button, StyleSheet } from "react-native";

interface LoadingViewProps {
  onRetryPress: () => void | Promise<void>;
}

function LoadingErrorView({ onRetryPress }: LoadingViewProps) {
  return (
    <View style={styles.container} backgroundColor="screen.800">
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

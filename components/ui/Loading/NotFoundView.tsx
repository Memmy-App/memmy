import React from "react";
import { Text, View } from "native-base";
import { Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function LoadingErrorView() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container} backgroundColor="screen.800">
      <Text fontStyle="italic" color="gray.500">
        🤨That content or community was not found🧐
      </Text>
      <Button title="Go Back" onPress={() => navigation.pop()} />
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

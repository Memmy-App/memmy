import React from "react";
import { Text, useTheme, View } from "native-base";
import { Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function NotFoundView() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  return (
    <View style={styles.container} backgroundColor={theme.colors.app.bg}>
      <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
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

export default NotFoundView;

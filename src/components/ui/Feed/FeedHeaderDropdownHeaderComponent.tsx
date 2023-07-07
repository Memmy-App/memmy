import React from "react";
import { StyleSheet } from "react-native";
import { Text, useTheme, View } from "native-base";

interface FeedHeaderDropdownHeaderComponentProps {
  text: string;
}

function FeedHeaderDropdownHeaderComponent({
  text,
}: FeedHeaderDropdownHeaderComponentProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text color={theme.colors.app.textSecondary} ml={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    padding: 5,
  },
});

export default FeedHeaderDropdownHeaderComponent;

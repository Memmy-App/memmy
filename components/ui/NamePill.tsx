import React from "react";
import { Text } from "native-base";

function NamePill({ text, color }: { text: string; color: string }) {
  return (
    // <View px={1} borderRadius={10} backgroundColor={color}>
    <Text color={color} fontWeight="bold">
      {text}
    </Text>
    // </View>
  );
}

export default NamePill;

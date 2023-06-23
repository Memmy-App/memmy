import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme, VStack } from "native-base";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.backgroundSecondary} />
  );
}

export default InboxScreen;

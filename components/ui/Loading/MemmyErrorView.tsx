import React from "react";
import { Text, useTheme, VStack } from "native-base";
import { Button } from "react-native";
import { IconMoodSad } from "tabler-icons-react-native";
import { sendLog } from "../../../helpers/LogHelper";

function MemmyErrorView() {
  const theme = useTheme();

  return (
    <VStack
      flex={1}
      px={3}
      justifyContent="center"
      alignItems="center"
      backgroundColor="app.bg"
      space={2}
    >
      <IconMoodSad size={150} color={theme.colors.app.textSecondary} />
      <Text textAlign="center">
        Well that&apos;s awkward. Memmy encountered an error. Please restart the
        app...
      </Text>
      <Text textAlign="center">
        We don&apos;t like bugs and you probably don&apos;t either. If you
        don&apos;t mind, could you please submit the logs? ♥️
      </Text>
      <Button title="Submit Logs" onPress={() => sendLog()} />
    </VStack>
  );
}

export default MemmyErrorView;

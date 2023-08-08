import React from "react";
import { useTranslation } from "react-i18next";
import { Text, VStack } from "@src/components/gluestack";
import { SFIcon } from "@src/components/common/icons/SFIcon";

function MemmyErrorView(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <VStack
      flex={1}
      px="$3"
      justifyContent="center"
      alignItems="center"
      backgroundColor="app.bg"
      space="sm"
    >
      <SFIcon icon="hand.thumbsdown.fill" />
      <Text textAlign="center">{t("memmyError.title")}</Text>
      <Text textAlign="center">{t("memmyError.description")}</Text>
      {/* <Button title={t("memmyError.submitBtn")} onPress={() => sendLog()} /> */}
    </VStack>
  );
}

export default MemmyErrorView;

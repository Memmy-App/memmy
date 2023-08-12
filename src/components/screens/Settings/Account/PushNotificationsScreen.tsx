import React from "react";
import { useTranslation } from "react-i18next";
import { VStack } from "@src/components/gluestack";
import { Section, TableView } from "@gkasdorf/react-native-tableview-simple";

function PushNotificationsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <VStack>
      <TableView>
        <Section header={t("Push Notifications")} />
      </TableView>
    </VStack>
  );
}

export default PushNotificationsScreen;

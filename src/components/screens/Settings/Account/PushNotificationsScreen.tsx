import React from "react";
import { VStack } from "@components/common/Gluestack";
import { useTranslation } from "react-i18next";
import CTable from "../../../common/Table/CTable";
import CSection from "../../../common/Table/CSection";

function PushNotificationsScreen() {
  const { t } = useTranslation();

  return (
    <VStack>
      <CTable>
        <CSection header={t("Push Notifications")} />
      </CTable>
    </VStack>
  );
}

export default PushNotificationsScreen;

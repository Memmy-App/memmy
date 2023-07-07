import React from "react";
import { VStack } from "native-base";
import CTable from "../../../ui/Table/CTable";
import CSection from "../../../ui/Table/CSection";

function PushNotificationsScreen() {
  return (
    <VStack>
      <CTable>
        <CSection header="PUSH NOTIFICATIONS" />
      </CTable>
    </VStack>
  );
}

export default PushNotificationsScreen;

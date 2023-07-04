import React from "react";
import { VStack } from "native-base";
import CTable from "../../../ui/table/CTable";
import CSection from "../../../ui/table/CSection";

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

import React from "react";
import { VStack } from "native-base";
import CTable from "../../../common/Table/CTable";
import CSection from "../../../common/Table/CSection";

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

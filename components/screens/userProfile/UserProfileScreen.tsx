import React from "react";
import { VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";

function BookmarksScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  return (
    <VStack flex={1} backgroundColor="screen.800">
      <CTable>
        <CSection header="USER PROFILE">
          <CCell
            title="Subscriptions"
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("Subscriptions");
            }}
          />
          <CCell
            title="Blocked Communities"
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("BlockedCommunities");
            }}
          />
        </CSection>
      </CTable>
    </VStack>
  );
}

export default BookmarksScreen;

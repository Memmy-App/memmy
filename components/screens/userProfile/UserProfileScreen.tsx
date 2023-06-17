import React from "react";
import {VStack} from "native-base";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";

const BookmarksScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    return (
        <VStack
            flex={1}
            backgroundColor={"screen.800"}
        >
            <CTable>
                <CSection
                    props={{
                        header: "USER PROFILE",
                    }}
                >
                    <CCell
                        title={"Subscriptions"}
                        accessory={"DisclosureIndicator"}
                        onPress={() => {
                            navigation.push("Subscriptions");
                        }}
                    />
                </CSection>
            </CTable>
        </VStack>
    );
};

export default BookmarksScreen;
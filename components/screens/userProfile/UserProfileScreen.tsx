import React from "react";
import {useAppSelector} from "../../../store";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {useTheme, VStack} from "native-base";
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
                        props={{
                            title: "Subscriptions",
                            accessory: "DisclosureIndicator",
                            onPress: () => {
                                navigation.push("Subscriptions");
                            }
                        }}
                    />
                    <CCell
                        props={{
                            title: "Bookmarks",
                            accessory: "DisclosureIndicator",
                            onPress: () => {
                                navigation.push("Bookmarks");
                            }
                        }}
                    />
                </CSection>
            </CTable>
        </VStack>
    );
};

export default BookmarksScreen;